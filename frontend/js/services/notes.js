
export default class NoteService {
  constructor (state, bus, uuid) {
    this.state = state
    this.bus = bus
    this.types = this.state.events.notes
    this.uuid = uuid
  }

  findById (arr, id) {
    return arr.find(_ => _.id === id)
  }

  loadLocalNotes () {
    let notes = window.localStorage.getItem('notes')
    if (notes != null) {
      notes = JSON.parse(notes)
      notes.notes.map((note) => {
        note.saved = true
        return note
      })
      return notes
    } else {
      this.saveLocalNotes()
      return this.loadLocalNotes()
    }
  }

  saveLocalNotes (data = {notes: []}) {
    window.localStorage.setItem('notes', JSON.stringify(data))
  }

  updateNotesStates (local, origin) {
    local.forEach((note) => {
      const originNote = this.findById(origin, note.id)
      const isNew = originNote == null
      if (isNew) {
        note.new = true
        note.sync = false
      } else {
        note.new = false
        const isMoreRecent = originNote.updatedAt < note.updatedAt
        if (!isMoreRecent) {
          note.sync = false
        } else {
          note.sync = true
          Object.assign(note, originNote)
        }
      }
    })
  }

  getUnsavedNotes (origin, local) {
    return origin
      .filter((originNote) => {
        return local.find(note => note.id === originNote.id) == null
      })
      .map((note) => {
        note.sync = true
        note.new = false
        note.saved = true
        return note
      })
  }

  mergeNotes (local, origin) {
    this.updateNotesStates(local, origin)
    const unsavedNotes = this.getUnsavedNotes(origin, local)
    return local.concat(unsavedNotes)
  }

  resaveUnsyncedNotes (notes) {
    notes.filter(note => !note.sync).forEach(note => this.bus.emit(this.types.SAVE_NOTE, note))
  }

  createNote () {
    return {
      sync: false,
      saved: false,
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: this.uuid(),
      new: true
    }
  }

  removeFromLocal (notes, id) {
    return notes.filter(_ => _.id !== id)
  }
}
