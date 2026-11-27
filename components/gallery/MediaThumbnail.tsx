import { Image as ImageIcon } from "lucide-react";

const widths = [320, 480, 720, 960];

function cloudinaryThumbnail(src: string, video: boolean, width: number) {
  const match = src.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(v\d+\/[^?#]+)$/);
  if (!match || match[2] !== (video ? "video" : "image")) return undefined;

  const asset = video ? match[3].replace(/\.[^./]+$/, "") + ".jpg" : match[3];
  return match[1] + "c_limit,w_" + width + ",f_auto,q_auto/" + asset;
}

export default function MediaThumbnail({
  src, poster, video = false, sizes, alt, className,
}: {
  src: string;
  poster?: string | null;
  video?: boolean;
  sizes: string;
  alt: string;
  className: string;
}) {
  const image = video ? poster : src;
  const source = image || src;
  const extractFrame = video && !image;
  const thumbnail = cloudinaryThumbnail(source, extractFrame, 480);
  const srcSet = thumbnail && widths.map((width) =>
    cloudinaryThumbnail(source, extractFrame, width) + " " + width + "w"
  ).join(", ");

  if (!thumbnail && !image) {
    return <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-rose-300">
      <ImageIcon className="size-7" />
    </span>;
  }

  return (
    // A Cloudinary srcset keeps the original media URL available for the full-size viewer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={thumbnail || image || undefined}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(event) => {
        const target = event.currentTarget;
        if (image && thumbnail && target.hasAttribute("srcset")) {
          target.removeAttribute("srcset");
          target.src = image;
        } else {
          target.style.visibility = "hidden";
        }
      }}
    />
  );
}
