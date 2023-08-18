import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import Home from '@mui/icons-material/Home';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import style from './movie-detail.module.css'

function MovieDetail() {
    const params = useParams(); // to get movie ID from URL
    const [movie, setMovie] = useState();
    const [directors, setDirector] = useState([]);
    const [cast, setCast] = useState([])

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${params.id}?api_key=c2ce9c4b90b2697d2021ce5ee7aff683`)
            .then(response => {
                setMovie(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error(error);
            });

        axios.get(`https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=c2ce9c4b90b2697d2021ce5ee7aff683`)
            .then(response => {
                console.log(response.data)
                setDirector((response.data.crew).filter((item) => item.job === 'Director'))
                setCast(response.data.cast)
                console.log(directors, cast)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    var date = new Date((movie) ? movie.release_date : '')

    function toHoursAndMinutes(totalMinutes) { // Converts Minutes to HoursAndMinutes
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        return `${hours}h ${minutes}m`;
    }

    return (
        <div>
            <AppBar sx={{ backgroundColor: '#fff', color: '#333' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 500, fontSize: 20 }}>
                        Movie Details
                    </div>
                    <Home />
                </Toolbar>
            </AppBar>
            <Box height="5rem"></Box>
            {movie ?
                (<div className={style.details}>
                    <div style={{ maxWidth: 250 }}>
                        <img src={(`https://image.tmdb.org/t/p/original${movie.poster_path}`)} style={{ width: '100%' }} />
                    </div>
                    <div className={style.text}>
                        <div className={style.title}>
                            <Typography gutterBottom variant="h5" component="div" style={{ paddingRight: 20 }}>
                                {movie.title}
                            </Typography>
                            <div style={{ minWidth: 165, paddingBottom: 10 }}>
                                {movie.vote_average ?
                                    (<StarRatings
                                        rating={movie.vote_average / 2}
                                        starDimension="20px"
                                        starSpacing="8px"
                                        starRatedColor="#FF9529"
                                    />
                                    ) : ''}
                            </div>
                        </div>
                        <Typography variant="body1" color="text.secondary" >
                            <div>
                                {date.getFullYear()} |
                                <span style={{ padding: 10 }}>
                                    {toHoursAndMinutes(movie.runtime)}
                                </span>|
                                <span style={{ paddingLeft: 10 }}>
                                    {directors.length > 1 ? 'Directors' : 'Director'}:
                                    {directors.map((director, index) => <span key={director.id} style={{ padding: 5 }}>{director.name}
                                        {directors.length !== index + 1 ? ',' : '.'}</span>)}
                                </span>
                            </div>
                            <div style={{ paddingBlock: "10px" }}>
                                Cast: {(cast.slice(0, 5)).map((acting, index) => <span style={{ padding: 5 }} key={acting.id}>{acting.name}
                                    {index < 4 ? ',' : ', ...'}</span>)}
                            </div>
                            {movie.overview}
                        </Typography>

                    </div>
                </div >) : <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}

        </div>
    );
}

export default MovieDetail;
