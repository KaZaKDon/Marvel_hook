class MarvelService {
    //_apiBase ='https://gateway.marvel.com:443/v1/public/';
    _apiBase ='https://marvel-server-zeta.vercel.app/';
    //_apiKey = process.env.REACT_APP_MARVEL_KEY;
    _apiKey='d4eecb0c66dedbfae4eab45d312fc1df';
    _baseOffset = 0;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&apikey=${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?apikey=${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        const isImageAvailable = !char.thumbnail.path.includes('image_not_available')
        return {
            id: char.id || Math.random(),
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            imageAvailable: isImageAvailable,
            comics: char.comics.items.map(item => ({ name: item.name }))
        }
    }
}

export default MarvelService;
