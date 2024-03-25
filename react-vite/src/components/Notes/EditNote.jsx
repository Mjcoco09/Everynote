import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editNote, noteInfo } from "../../redux/notes";
import { noteThunk } from "../../redux/home";

function EditNote() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const noteDeets = useSelector((state) => state.notes?.note);
  const notebooks = useSelector((state) => state.home.notebook);
  const defaultNotebook = notebooks?.find(
    (notebook) => notebook.id === noteDeets.notebook_id
  );
  const [name, setName] = useState();
  const [info, setInfo] = useState();
  const [notebook_id, setNotebook_id] = useState(noteDeets?.notebook_id);
  const [tags, setTags] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(noteInfo(Number(noteId))).then((note) => {
      setName(note.note.name);
      setInfo(note.note.info);
      setTags(note.note.tags);
    });
    dispatch(noteThunk());
  }, [dispatch]);

  useEffect(() => {
    const errs = {};

    if (!name) {
      errs.name = "Name of note required";
    }
    if (name.toLowerCase().includes("notebook")) {
      errs.name = 'Name of note cannot contain the word "notebook"';
    }
    if (noteNames?.includes(name)) {
      errs.name = "Name already exists";
    }
    if (name.length > 20) {
      errs.name = "Name cannot exceed 20 characters";
    }
    if (!info) {
      errs.info = "Note information required";
    }
    if (info.length < 30) {
      errs.info = "Note information must be a minimium of 30 characters";
    }
    setErrors(errs);
  }, [name, info]);

  const submitChanges = async (e) => {
    e.preventDefault();

    const edits = {
      notebook_id,
      name,
      info,
    };

    const tag = tags.split(" ");
    if (tag.length > 5) {
      setErrors((errors.tags = "Too many entered tags"));
    }

    await dispatch(editNote(noteId, edits)).then(navigate(`/notes/${noteId}`));
  };

  return (
    <>
      <h1>Edit Your Note</h1>
      <form onSubmit={submitChanges}>
        <div className="name">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <p>{errors.name}</p>
        </div>
        <div className="info">
          <textarea
            type="text"
            placeholder="Note Information"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          ></textarea>
          <p>{errors.info}</p>
        </div>
        <div className="notebook">
          <div>Assigned Notebook</div>
          <select onChange={(e) => setNotebook_id(e.target.value)}>
            <option value={defaultNotebook?.id}>{defaultNotebook?.name}</option>
            {notebooks &&
              notebooks?.map((notebook) => (
                <option key={notebook.id} value={notebook.id}>
                  {notebook.name}
                </option>
              ))}
          </select>
        </div>
        <div className="tags">
          <p>Note's Tags</p>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          ></input>
        </div>
        <div className="buttons">
          <button
            className="button"
            type="submit"
            disabled={Object.values(errors).length}
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}

export default EditNote;
