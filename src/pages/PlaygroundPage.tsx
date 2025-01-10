import Onboarding from "../components/Onboarding";
import SearchBox from "../components/SearchBox";
import TermsAndConditions from "../components/TermsAndConditions";

const PlaygroundPage = () => {
  return <SearchBox onChange={(text) => console.log(text)} />;
};

export default PlaygroundPage;
