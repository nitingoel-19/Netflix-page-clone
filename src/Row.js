import React, { useState, useEffect } from 'react';
import movieTrailer from 'movie-trailer';
import Youtube from 'react-youtube';
import axios from './axios';
import './Row.css';

const baseUrl = 'https://image.tmdb.org/t/p/original';
function Row({ title, fetchUrl, isLargeRow }) {
  //react hooks useEffect and useState
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  //snippet of code which runs based on specific condition
  useEffect(() => {
    //if [] then run only once when the row loads
    //if [variable] then run when row loads and run when variable value changes
    async function fetchData() {
      //it take some time in fetching from tmdb
      //axios gives instance and remaining from prop fetchUrl passed from Row
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    //eternal variable in useEffect ust be put in like [fetchUrl] as it
    //is dependency in this way useEffect refires the code when fetchUrl
    //changes
  }, [fetchUrl]);

  const opts = {
    height: '390',
    width: '99%',
    playerVars: {
      autoplay: 0,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      //if already open then close it
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.title || '')
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id}
            className={`row_poster ${isLargeRow && 'row_posterLarge'} `}
            src={`${baseUrl}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

//there can be only one default export in one file
export default Row;