import { Notes } from "../components/Notes/Notes";

export const Home = (props) => {
  return (
    <div>
      <Notes showAlert={props.showAlert}/>
    </div>
  );
};
