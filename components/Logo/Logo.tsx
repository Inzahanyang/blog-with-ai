/* eslint-disable react/no-unescaped-entities */
import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Logo = () => (
  <div className="text-center py-4 text-3xl font-heading">
    Jiny's Magic Blog
    <FontAwesomeIcon
      icon={faMagicWandSparkles}
      className="text-xl text-yellow-400 pl-2"
    />
  </div>
);
