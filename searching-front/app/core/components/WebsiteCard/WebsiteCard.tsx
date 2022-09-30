import { cleanUrlForUi } from 'app/core/helpers/common';
import s from './styles.module.css'

interface Props {
    url: string;
    title: string;
    description: string;
}
const WebsiteCard = (props:Props) => {
    return <div className={s.root}>
        <a  className={s.titleLink} href={props.url}>{props.title}</a>
        <a  className={s.miniLink} href={props.url}>{cleanUrlForUi(props.url)}</a>
        <div  className={s.description}>{props.description}</div>
    </div>
}

export default WebsiteCard;