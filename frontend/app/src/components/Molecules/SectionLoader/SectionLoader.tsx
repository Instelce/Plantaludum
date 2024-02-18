import "./SectionLoader.scss"
import Loader from "../../Atoms/Loader";

type SectionLoaderProps = {
    isLoading: boolean
}

function SectionLoader({isLoading}: SectionLoaderProps) {
    if (isLoading) {
      return (
        <div className="center-loader">
            <Loader />
        </div>
      )
    }

    return null;
}

export default SectionLoader;