import express from 'express'
import {
    searchPerson,
    searchMovie,
    searchTv,
    getSearchHistory,
    deleteSearchHistory
} from '../controllers/searchControllers.js';

const router = express.Router();

router.get('/person/:query', searchPerson);
router.get('/movie/:query', searchMovie);
router.get('/tv/:query', searchTv);

router.get("/history", getSearchHistory);
router.delete("/history/:id", deleteSearchHistory);


export default router;