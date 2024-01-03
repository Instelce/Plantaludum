import "./DeckLevelCard.scss";
import classNames from "classnames";
import {Lock} from "react-feather";
import {Link} from "react-router-dom";
import {DeckType} from "../../../services/api/types/decks";
import Stars from "../../Atoms/Stars/Stars";

type DeckLevelCardProps = {
  deck: DeckType;
  level: number;
  levelStars: number;
  isReached?: boolean;
}

function DeckLevelCard({deck, level, levelStars, isReached}: DeckLevelCardProps) {
  // const waveAnimation = useRef<AnimeInstance | null>(null)

  // useEffect(() => {
  //   waveAnimation.current = anime({
  //     targets: `.wave-path`,
  //     d: [
  //       {value: "M0,160L48,138.7C96,117,192,75,288,96C384,117,480,203,576,234.7C672,267,768,245,864,218.7C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"},
  //       {value: "M0,288L48,261.3C96,235,192,181,288,186.7C384,192,480,256,576,277.3C672,299,768,277,864,224C960,171,1056,85,1152,53.3C1248,21,1344,43,1392,53.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"},
  //       // {value: "M0,160L48,160C96,160,192,160,288,181.3C384,203,480,245,576,250.7C672,256,768,224,864,213.3C960,203,1056,213,1152,213.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"},
  //     ],
  //     duration: 4000,
  //     loop: true,
  //     direction: "alternate",
  //     easing: "easeInOutCubic",
  //   })
  // }, []);

  return (
    <Link to={isReached ? `/decks/${deck.id}/game/${level}` : "#"} className={classNames("deck-level-card", `level-${level}`, {'not-reached': !isReached})}>
      <div className="img-container">
        <img src={deck.preview_image_url} alt="Card image" />
      </div>

      {isReached && (
        <>
          <div className="progression-wave" style={{height: `${(levelStars-1) * 50}%`}}>
            {/*<img src={deck.preview_image_url} alt="Card image" />*/}
          {/*  <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">*/}
          {/*    <path className="wave-path" fill="#0099ff" fillOpacity="1" d="M0,288L48,261.3C96,235,192,181,288,186.7C384,192,480,256,576,277.3C672,299,768,277,864,224C960,171,1056,85,1152,53.3C1248,21,1344,43,1392,53.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>*/}
          </div>

          <Stars count={levelStars} />
        </>
      )}

      {!isReached && (
        <div className="lock">
          <Lock size={40} />
        </div>
      )}

    </Link>
  )
}

export default DeckLevelCard