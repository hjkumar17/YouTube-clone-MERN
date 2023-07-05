import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../Css/likevideos.css";

function LikeVideos() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [menuClicked, setMenuClicked] = useState(false);
  const [videolike, setLikedVideos] = useState([]);
  const [VideoViews, setVideoViews] = useState();

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
    setName(jwtDecode(token).name);
  }, []);

  useEffect(() => {
    const getLikeVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getlikevideos/${email}`
        );
        const result = await response.json();
        setLikedVideos(result);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getLikeVideos, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
  }, []);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/getvideos");
        const { views } = await response.json();

        setVideoViews(views);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideos();
  }, []);

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="liked-video-data">
        {videolike.length > 0 ? (
          <div
            className="like-video-sections"
            style={
              menuClicked ? { left: "80px", width: "100%" } : { left: "255px" }
            }
          >
            <div
              className="like-left-section"
              style={{
                backgroundImage: `url(${videolike[0]?.thumbnailURL})`,
              }}
            >
              <div className="page-cover">
                {videolike && (
                  <div className="firstvideo-thumbnail">
                    <img
                      src={videolike[0].thumbnailURL}
                      alt="first-like-thumbnail"
                      className="first-thumbnail"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="last-like-section">
                  <p className="like-head">Liked videos</p>
                  <div className="last-like2">
                    <p className="like-username">{name}</p>
                    <p className="like-total-videos">
                      {videolike.length} videos
                    </p>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    navigate(`/video/${videolike[0].likedVideoID}`);
                    window.location.reload();
                    if (token) {
                      updateViews(videolike[0].likedVideoID);
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <div className="like-right-section">
              {videolike.length > 0
                ? videolike.map((element, index) => {
                    return (
                      <div className="liked-all-videos" key={index}>
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data"
                          onClick={() => {
                            navigate(`/video/${element.likedVideoID}`);
                            window.location.reload();
                            if (token) {
                              updateViews(element.likedVideoID);
                            }
                          }}
                        >
                          <img
                            src={element.thumbnailURL}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <div className="its-content">
                            <p>{element.Title}</p>
                            <p>
                              {element.uploader} &#x2022;{" "}
                              {VideoViews[index] >= 1e9
                                ? `${(VideoViews[index] / 1e9).toFixed(1)}B`
                                : VideoViews[index] >= 1e6
                                ? `${(VideoViews[index] / 1e6).toFixed(1)}M`
                                : VideoViews[index] >= 1e3
                                ? `${(VideoViews[index] / 1e3).toFixed(1)}K`
                                : VideoViews[index]}{" "}
                              views
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
          <div className="spinner" style={{ height: "100vh" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default LikeVideos;
