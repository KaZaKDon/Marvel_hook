import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { charShape } from '../../utils/charShape';
import './charInfo.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = ({ charId }) => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

useEffect(() => {
    if (!charId) return;

    clearError();
    getCharacter(charId)
        .then((charData) => {
            setChar(charData);
        })

}, []); // эффект зависит от charId

    const skeleton = !char && !loading && !error ? <Skeleton /> : null;
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );
};

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics, imageAvailable } = char;

    const descr = description
        ? description.length > 150
            ? description.slice(0, 150) + '...'
            : description
        : 'Полное описание персонажа при переходе по ссылке';

    const imgStyle = {
        width: 150,
        height: 150,
        objectFit: imageAvailable ? 'cover' : 'contain'
    };

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{descr}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0
                    ? comics.map((item, i) => (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    ))
                    : 'Нет ни одного комикса с участием данного персонажа'}
            </ul>
        </>
    );
};

View.propTypes = {
    char: charShape
};

CharInfo.propTypes = {
    charId: PropTypes.number
};

export default CharInfo;