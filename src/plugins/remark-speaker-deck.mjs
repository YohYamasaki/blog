const oEmbedEndpoint = "https://speakerdeck.com/oembed.json";
const embedCache = new Map();

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const sameUrl = (first, second) => {
  try {
    return new URL(first).toString() === new URL(second).toString();
  } catch {
    return false;
  }
};

const getStandaloneUrl = (node) => {
  if (node.type !== "paragraph" || node.children.length !== 1) return null;

  const child = node.children[0];

  if (child.type === "text") return child.value.trim();

  if (
    child.type === "link" &&
    child.children.length === 1 &&
    child.children[0].type === "text" &&
    sameUrl(child.url, child.children[0].value)
  ) {
    return child.url;
  }

  return null;
};

const getSpeakerDeckUrl = (value) => {
  try {
    const url = new URL(value);
    const isSpeakerDeck =
      url.hostname === "speakerdeck.com" ||
      url.hostname === "www.speakerdeck.com";
    const isDeckPath = url.pathname.split("/").filter(Boolean).length >= 2;

    return url.protocol === "https:" && isSpeakerDeck && isDeckPath
      ? url
      : null;
  } catch {
    return null;
  }
};

const getPlayerUrl = (html) => {
  if (typeof html !== "string") return null;

  const source = html.match(/\bsrc=(["'])(.*?)\1/i)?.[2];
  if (!source) return null;

  try {
    const url = new URL(source);
    const isPlayer =
      url.protocol === "https:" &&
      url.hostname === "speakerdeck.com" &&
      url.pathname.startsWith("/player/");

    return isPlayer ? url : null;
  } catch {
    return null;
  }
};

const getDimension = (value, fallback) => {
  const dimension = Number(value);
  return Number.isFinite(dimension) && dimension > 0 && dimension <= 10_000
    ? dimension
    : fallback;
};

const createEmbed = async (deckUrl) => {
  const endpoint = new URL(oEmbedEndpoint);
  endpoint.searchParams.set("url", deckUrl.toString());

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok)
    throw new Error(`oEmbed request failed with ${response.status}`);

  const data = await response.json();
  const playerUrl = getPlayerUrl(data.html);

  if (data.type !== "rich" || !playerUrl) {
    throw new Error("oEmbed response did not contain a Speaker Deck player");
  }

  const width = getDimension(data.width, 710);
  const height = getDimension(data.height, 399);
  const title = escapeHtml(
    typeof data.title === "string" && data.title.length > 0
      ? `Speaker Deck: ${data.title}`
      : "Speaker Deck presentation",
  );
  const src = escapeHtml(playerUrl.toString());

  return `
<figure class="speakerdeck-preview" style="--speakerdeck-aspect-ratio: ${width} / ${height}">
  <iframe class="speakerdeck-preview__player" src="${src}" title="${title}" width="${width}" height="${height}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen" allowfullscreen></iframe>
</figure>
`.trim();
};

const getEmbed = (deckUrl) => {
  const key = deckUrl.toString();

  if (!embedCache.has(key)) {
    const embed = createEmbed(deckUrl).catch((error) => {
      embedCache.delete(key);
      throw error;
    });
    embedCache.set(key, embed);
  }

  return embedCache.get(key);
};

const remarkSpeakerDeck = () => async (tree) => {
  const candidates = tree.children.flatMap((node, index) => {
    const value = getStandaloneUrl(node);
    const url = value ? getSpeakerDeckUrl(value) : null;
    return url ? [{ index, url }] : [];
  });

  const replacements = await Promise.all(
    candidates.map(async ({ index, url }) => {
      try {
        return { index, value: await getEmbed(url) };
      } catch (error) {
        console.warn(
          `[remark-speaker-deck] Could not create a preview for ${url}. The original link was preserved.`,
          error,
        );
        return null;
      }
    }),
  );

  for (const replacement of replacements) {
    if (!replacement) continue;
    tree.children[replacement.index] = {
      type: "html",
      value: replacement.value,
    };
  }

  return tree;
};

export default remarkSpeakerDeck;
