'use client'

import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React, { useState } from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url
  const [imageError, setImageError] = useState(false)

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder 
        image={initialImage} 
        size={size} 
        onError={() => setImageError(true)}
        showPlaceholder={imageError} 
      />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  onError,
  showPlaceholder = false
}: Pick<ThumbnailProps, "size"> & { 
  image?: string, 
  onError?: () => void,
  showPlaceholder?: boolean 
}) => {
  // If we have an image and no errors, show the image
  if (image && !showPlaceholder) {
    return (
      <Image
        src={image}
        alt="Thumbnail"
        className="absolute inset-0 object-cover object-center"
        draggable={false}
        quality={50}
        sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
        fill
        onError={onError}
        loading="eager"
        priority
      />
    )
  }
  
  // Otherwise show placeholder
  return (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
