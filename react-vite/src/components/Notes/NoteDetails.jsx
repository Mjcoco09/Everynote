import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { noteInfo } from "../../redux/notes";

function NoteInfo() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const noteDetails = useSelector((state) => state.notes.note);
  const tags = useSelector((state) => state.notes.tags);
  const dispatch = useDispatch();

  const edit = () => {
    navigate(`/notes/${noteId}/edit`);
  };
  useEffect(() => {
    dispatch(noteInfo(Number(noteId)));
  }, [dispatch, noteId]);

  return (
    <>
      <h1>{noteDetails?.name}</h1>
      <p>{noteDetails?.info}</p>
      <div>
        <button onClick={edit}>Edit Note</button>
      </div>
      <div>
        {!tags?.length ? (
          <></>
        ) : (
          <div>
            {tags && tags.map((allTags) => allTags.map((tag) => <div key={tag.id}>#{tag.name}</div>))}
          </div>
        )}
      </div>
    </>
  );
}
/* <div><i class="fa-solid fa-square-xmark"></i></div> */

export default NoteInfo;
