"use client";
import { useEffect, useState, useRef } from "react";
import useStore from "@/utils/store";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react"; // Assuming you have installed and imported the lucide-react library

const User = ({ params }) => {
  const {
    userCache,
    setUserCache,
    cacheExpiration,
    userPhotosCache,
    setUserPhotosCache,
    userPhotocsPageCache,
    setUserPhotocsPageCache,
    resetUserCache,
    resetUserPhotosCache,
    resetUserPhotocsPageCache,
  } = useStore();
  const [user, setUser] = useState(null);
  const [userPics, setUserPics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error,setError] = useState(false);

  const loader = useRef(null);

  console.log(error);
  // console.log(userPhotosCache);
  // console.log(userPhotocsPageCache);

  // console.log(userPics);

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

  // console.log(loading, page);

  useEffect(() => {
    const fetchUser = async () => {
      // if (!userPhotosCache[params.userId]) setLoading(true);
      try {
        //         resetUserCache();
        //         resetUserPhotosCache()
        // resetUserPhotocsPageCache()
        //         return;
        if (
          userCache[params.userId] &&
          Date.now() - userCache[params.userId].timestamp < cacheExpiration &&
          userPhotocsPageCache[params.userId][page] &&
          Date.now() - userPhotocsPageCache[params.userId][page].timestamp <
            cacheExpiration
        ) {
          console.log("using cache");
          setUser(userCache[params.userId].username);
          setUserPics(userPhotosCache[params.userId].photos);
          return;
        }
        if (user == null) {
          const res = await axios.post("/api/users", {
            id: params.userId,
            page: page,
          });
          setUser(res.data.data1);
          if(res.data.data1.errors){
            console.log("Nothing found");
            setError(true);
            return;
          }
        }
        const res = await axios.post("/api/userPhotos", {
          id: params.userId,
          page: page,
        });
        console.log("calling setUserPhotocsPageCache");
        setUserPhotocsPageCache(params.userId, page, res.data.data2);
        setUserPics((prev) => [...prev, ...res.data.data2]);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [page]);

  useEffect(() => {
    if (user) {
      setUserCache(user);
    }
  }, [user]);

  useEffect(() => {
    if (userPics) {
      setUserPhotosCache(params.userId, userPics);
    }
  }, [userPics]);


  return (
    <div style={{ height: "100%" }}>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="user-container">
        {error&&(<div>No user found</div>)}
          {userCache[params.userId]?.username && (
            <>
              <div>
                {/* User's profile photo in a circular format */}
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={
                      userCache[params.userId].username.profile_image?.medium
                    }
                    width={200}
                    height={200}
                    alt={userCache[params.userId].username.username}
                  />
                </div>

                <div className="insta">
                  {/* User's Instagram handle linked to Lucide React Insta icon */}
                  <Link
                    href={`https://www.instagram.com/${
                      userCache[params.userId].username.instagram_username
                    }`}
                    target="_blank"
                  >
                    <Instagram alt={"insta"} />
                  </Link>
                </div>
              </div>

              {/* Grid of user's photos */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >
                {userPhotosCache[params.userId].photos.map((photo) => {
                  return (
                    <div key={photo.id} style={{}}>
                      <Image
                        src={photo.urls?.regular}
                        width={200}
                        height={200}
                        priority
                        alt={photo.id}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};

export default User;
