import './ErrorNoTarif.scss';

export default function ErrorNoTarif (props) {
    const {text} = props;
    console.log(text);
    return (
        <p className='error--noTarif'>{text}</p>
    );
}