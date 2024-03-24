from flask import Blueprint, request, redirect, url_for
from app.models import Note, User, Tag, Notebook, db
from app.forms.note_form import NoteForm
from app.forms.tag_form import TagForm
from flask_login import login_required, current_user

notes_route = Blueprint('notes', __name__)

@notes_route.route("")
@login_required
def get_notes():
    users = User.query.get(current_user.id)
    notes_data= [note.to_dict() for note in users.notes]
    return notes_data

@notes_route.route('<int:noteId>/edit', methods=['PUT'])
@login_required
def edit_note(noteId):
     adjust_note = Note.query.get(noteId)
     data = request.get_json()
     adjust_note.id=noteId
     adjust_note.user_id=current_user.id
     adjust_note.notebook_id=data['notebook_id']
     adjust_note.name=data['name']
     adjust_note.info=data['info']
     db.session.commit()
     return {'status': 201,
             'message': "Note Successfully Updated"}

@notes_route.route('<int:noteId>')
@login_required
def get_note(noteId):
        notes = Note.query.get(noteId)
        tags = Tag.query.get(noteId)
        note_data = notes.to_dict()
        tag = ''
        if tags:
             tag = tags.to_dict()
        data = {
              'note': note_data,
              'tags': tag,
        }
        return data

@notes_route.route('new-note', methods=['POST'])
@login_required
def new_note():
    add_note = NoteForm()
    data = request.get_json()
    print(data, "This is the new note data")
    if add_note:
         newNote = Note(
            #   id=
              user_id=current_user.id,
              notebook_id=data['notebook_id'],
              name=data['name'],
              info=data['info'],
              )
         print(newNote.to_dict(), '----!SHOULD show all the new note\'s info!----')
         db.session.add(newNote)
         db.session.commit()
         return  {'status': 201,
                  'message': "Note Successfully Created"}

@notes_route.route('<int:noteId>', methods=['DELETE'])
@login_required
def destroy_note(noteId):
        note = Note.query.get(noteId)
        db.session.delete(note)
        db.session.commit()
        return {'status': 200,
                'message': "Note Successfully Deleted"
                }

@notes_route.route('<int:noteId>/tags', methods=['POST'])
@login_required
def add_tags():
    tags = Tag.query.all()
    data = request.get_json()
    print(data, 'TAG DATA')
    add_tag = TagForm()
    print(data, '--------------from tags route')
    if add_tag:
        new_tag = Tag(
        #  id=int(len(tags))+1,
         userId= current_user.id,
         noteId= noteId,
         name=data['name'],
        )
        db.session.add(new_tag)
        db.session.commit()
    print(new_tag, "NEW TAG(S)")
    return new_tag.to_dict()
