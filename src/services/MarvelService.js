import { useHttp } from "../hooks/http.hook";
import { useCallback } from "react";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'd4eecb0c66dedbfae4eab45d312fc1df';
    const _baseOffset = 0;

    const getAllComics = useCallback(async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformComic);
    }, [request]);

    const getComics = useCallback(async (id) => {
        const res = await request(`${_apiBase}comics/${id}?apikey=${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }, [request]);

    const getAllCharacters = useCallback(async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }, [request]);

    const getCharacter = useCallback(async (id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }, [request]);

    const _transformComic = (comic) => {
        const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
        const isImageAvailable = !comic.thumbnail.path.includes('image_not_available');

        return {
            id: comic.id,
            title: comic.title || 'Без названия',
            description: comic.description || 'Описание отсутствует',
            pageCount: comic.pageCount ? `${comic.pageCount} pages` : 'No information about the number of pages',
            thumbnail,
            language: comic.textObjects?.languages || 'en-us',
            price: comic.prices?.[0]?.price ? `${comic.prices[0].price}$` : 'NOT AVAILABLE',
            homepage: comic.urls?.[0]?.url || '#',
            imageAvailable: isImageAvailable,
        };
    };

    const _transformCharacter = (char) => {
        const thumbnail = `${char.thumbnail.path}.${char.thumbnail.extension}`;
        const isImageAvailable = !char.thumbnail.path.includes('image_not_available');

        return {
            id: char.id,
            name: char.name || 'Имя отсутствует',
            description: char.description || 'Описание отсутствует',
            thumbnail,
            homepage: char.urls?.[0]?.url || '#',
            wiki: char.urls?.[1]?.url || '#',
            imageAvailable: isImageAvailable,
            comics: (char.comics?.items || []).map(item => ({ name: item })),
        };
    };

    return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComics };
};

export default useMarvelService;