import React from "react";
import { Link } from "react-router-dom";
import AlbumPageTrack from "./AlbumPageTrack";
import { connect } from "react-redux";

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  saveCurrentSong: (currentSong) => dispatch({ type: "SET_CURRENT_SONG", payload: currentSong }),
  addToFavorite: (song) => dispatch({ type: "ADD_SONGS_LIKED", payload: song }),
  removeFromFavorite: (id) => dispatch({ type: "REMOVE_SONGS_LIKED", payload: id }),
});
function AlbumPage(props) {
  const [albumID, setAlbumID] = React.useState(props.location.pathname.substr(7, props.location.pathname.length));
  const [albumData, setAlbumData] = React.useState({});
  const [trackList, setTracklist] = React.useState([]);
  console.log(props);
  const fetchAlbumDataHandler = async (endpoint) => {
    const API_BASE_URL = "https://yabba-dabba-duls-cors-anywhere.herokuapp.com/https://api.deezer.com/";

    try {
      const response = await fetch(`${API_BASE_URL}/album/${endpoint}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log("try fetch", data);
      setAlbumData(data);
      setTracklist(data.tracks.data);
    } catch (e) {
      console.error(`API ERROR : ${e.message}`);
    }
  };

  const currentSong = {
    cover: albumData.cover_medium,
    tracks: [...trackList],
    song: 0,
  };
  React.useEffect(() => {
    fetchAlbumDataHandler(albumID);
  }, []);

  return (
    <aside id='tracklist-page' className='d-flex justify-content-center align-items-center'>
      <div id='tracklist-container' className='w-100'>
        <Link to='/home'>
          <button id='back-button'>
            <i className='fas fa-chevron-left mr-2'></i>BACK
          </button>
        </Link>
        <div className='row'>
          <div className='left-wrapper col-6 d-flex flex-column justify-content-start align-items-center fade-in'>
            <div
              id='album-cover'
              className='mb-4'
              style={{
                background: `url(${albumData && albumData.cover_medium})`,
              }}
            ></div>
            <h2 id='album-name' className='text-center'>
              {albumData.title && albumData.title}
            </h2>
            <Link to={albumData.artist ? "/artist/" + albumData.artist.id : "/"}>
              <p id='artist-name'>{albumData.artist && albumData.artist.name}</p>
            </Link>
            <button className='btn btn-play mt-4 mb-2' onClick={() => props.saveCurrentSong(currentSong)}>
              PLAY
            </button>{" "}
            <p id='num-of-songs'> {albumData && albumData.nb_tracks} Songs </p>
            <div className='mini-buttons mt-4'>
              <button className='btn btn-heart' onClick={() => (props.user.liked.some((liked) => liked.id === albumData.id) ? props.removeFromFavorite(albumData.id) : props.addToFavorite(albumData))}>
                <i className={props.user.liked.some((liked) => liked.id === albumData.id) ? "fa fa-heart" : "far fa-heart"}></i>
              </button>
              <button className='btn btn-more'>...</button>
            </div>
            <div className='added-to-album d-none mt-3 swing-in-top-fwd '>Album added to your library.</div>
            <p className='albumid'></p>
          </div>
          <div className='right-wrapper col-6  d-flex flex-column justify-content-center align-items-start'>
            <div id='track-row' className='w-100'>
              {/*  Generate tracks here  */}
              {trackList.length > 0 &&
                trackList.map((track, index) => {
                  return <AlbumPageTrack key={index} index={index} track={track} trackList={trackList} cover={albumData.cover_medium} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumPage);
