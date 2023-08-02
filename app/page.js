"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useStore from "@/utils/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import HeartIcon from "@/components/HeartIcon";

export default function Home() {
  const router = useRouter();
  const [pics, setPics] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  console.log(pics);

  const { photos, setPhotos, photoCache, setPhotoCache, cacheExpiration } =
    useStore();
  console.log(photos);

  const loader = useRef(null);
  const currentPageRef = useRef(page);

  useEffect(() => {
    setPhotos(pics);
  }, [pics]);

  useEffect(() => {
    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      observer.disconnect();
    };
  }, [loading]);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (
        photoCache[page] &&
        Date.now() - photoCache[page].timestamp < cacheExpiration
      ) {
        console.log(Date.now() - photoCache[page].timestamp);
        // Cache is still valid, use the cached data
        setPics((prev) => [...prev, ...photoCache[page].data]);
        return;
      }
      // if(pics==null||pics.length<1) setLoading(true);
      
      try {
        const res = await axios.post(`/api/photos`, { page });
        const data = res.data;
        setPhotoCache(page, data);
        setPics((prev) => [...prev, ...data]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (page !== currentPageRef.current) {
      currentPageRef.current = page;
      fetchPhotos();
    }
  }, [page]);

  const decodeBlurhash = (blurhash, width, height) => {
    const size = width * height;
    const pixelData = [];
    for (let i = 0; i < size; i++) {
      const value = parseInt(blurhash.charAt(i), 36);
      const r = value >> 16;
      const g = (value >> 8) & 255;
      const b = value & 255;
      pixelData.push(r, g, b, 255);
    }
    return pixelData;
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="container">
          {photos.map((photo, index) => {
            const placeholderPixels = photo.blurhash
              ? decodeBlurhash(photo.blurhash, 300, 300) // Change the width and height accordingly
              : null;
            return (
              <div key={photo.id+page} className="post">
                <div className="user-info">
                  <span>{index + 1}.</span>
                  <span
                    onClick={() => router.push(`/user/${photo.user.username}`)}
                    style={{cursor:'pointer'}}
                  >
                    {photo.user.username}.
                  </span>
                </div>
                <div className="img">
                  {/* Display the Blurhash placeholder */}
                  {placeholderPixels && (
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(
                        placeholderPixels
                      ).toString("base64")}`}
                      width={300}
                      height={300}
                      alt={photo.alt_description}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  {/* Actual image */}
                  <Image
                    src={photo.urls.regular}
                    width={300}
                    height={300}
                    alt={photo.alt_description}
                  />
                  <div style={{ display: "flex" }}>
                    {photo.liked_by_user ? (
                      <div
                      >
                        <HeartIcon />
                      </div>
                    ) : (
                      <div
                      >
                        <Heart />
                      </div>
                    )}

                    <div style={{ margin: "20px", marginTop: "2px" }}>
                      {photo.likes}
                    </div>
                    {/* <div>{photo.liked_by_user ? "true" : "false"}</div> */}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={loader} />
        </div>
      )}
    </>
  );
}
