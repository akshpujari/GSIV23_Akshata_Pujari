import Home from '@mui/icons-material/Home';
import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, InputBase, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import styles from "./movie-list.module.css";
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const inputRef = useRef(null);
    const [pageNumber, setPageNumber] = useState(1)
    useEffect(() => {
        getMovies();
    }, []);

    const getMovies = (() => {
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=c2ce9c4b90b2697d2021ce5ee7aff683`)
            .then(response => {
                setMovies(response.data.results);
            })
            .catch(error => {
                console.error(error);
            });

    })

    const onSearchChange = ((movieName) => {
        setPageNumber(1)
        if (movieName.target.value) {
            axios.get(`https://api.themoviedb.org/3/search/movie?query=${movieName.target.value}&page=1&api_key=c2ce9c4b90b2697d2021ce5ee7aff683`)
                .then(response => {
                    setMovies(response.data.results)
                })
                .catch(error => {
                    console.error(error);
                });
        }
        else {
            getMovies();
        }
    })

    const clearSearch = (() => {
        getMovies();
        inputRef.current.value = null;
        console.log(inputRef, "input")
        setPageNumber(1)

    })

    const onLoadMore = (() => {
        console.log(inputRef.current.value)
        if (inputRef.current.value) {
            axios.get(`https://api.themoviedb.org/3/search/movie?query=${inputRef.current.value}&page=${pageNumber + 1}&api_key=c2ce9c4b90b2697d2021ce5ee7aff683`)
                .then(response => {
                    setMovies((oldMovies) => [...oldMovies, ...response.data.results])
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.get(`https://api.themoviedb.org/3/discover/movie?page=${pageNumber + 1}&api_key=c2ce9c4b90b2697d2021ce5ee7aff683`)
                .then(response => {
                    setMovies((oldMovies) => [...oldMovies, ...response.data.results])
                })
                .catch(error => {
                    console.error(error);
                });
        }
        setPageNumber((num) => num + 1)
    })

    return (
        <div>
            <AppBar sx={{ backgroundColor: '#fff', color: '#333' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box
                        className={styles.search}
                    >
                        <SearchIcon />
                        <InputBase placeholder="Search"
                            onChange={onSearchChange}
                            inputRef={inputRef}
                        />
                        <IconButton
                            onClick={clearSearch}
                        ><ClearIcon style={{ margin: 0 }} /></IconButton>
                    </Box>
                    <Home />
                </Toolbar>
            </AppBar>
            <Box height="5rem"></Box>

            {movies ?
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {movies.map(movie => (
                        <Grid item key={movie.id} >
                            <Link to={`${movie.id}/movie-detail`} style={{ textDecorationLine: "none" }}>
                                <Card sx={{ maxWidth: 250 }} >
                                    <CardActionArea >
                                        <CardMedia>
                                            <img src={(`https://image.tmdb.org/t/p/original${movie.poster_path}`)} style={{ width: '100%' }} />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div" style={{ height: 65 }}>
                                                {movie.title}
                                            </Typography>
                                            <div>
                                                {movie.vote_average ?
                                                    (<StarRatings
                                                        rating={movie.vote_average / 2}
                                                        starDimension="15px"
                                                        starSpacing="5px"
                                                        starRatedColor="#FF9529"
                                                    />
                                                    ) : ''}
                                            </div>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: "2",
                                                WebkitBoxOrient: "vertical",
                                            }}>
                                                {movie.overview}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                : <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>
            }
            <div className={styles.loadMoreButton}>
                <Button variant="contained" onClick={onLoadMore}>Load more</Button>
            </div>
        </div >
    );
}

export default MovieList;
