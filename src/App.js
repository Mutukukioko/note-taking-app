// App.js
import React, { useState, useEffect } from "react";
import { db, auth } from "./components/firebase";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Note from "./components/Note";
import SignIn from "./components/signin";
import SignUp from "./components/signup";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchNotes();
      } else {
        setNotes([]);
      }
    });
    

    return () => unsubscribe();
  }, []);

  const fetchNotes = async () => {
    const notesCollection = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCollection);
    const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotes(notesList);
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (user) {
    const notesCollection = collection(db, 'notes');
    await addDoc(notesCollection, { title, content });
    setNotes([...notes, { title, content }]);
    setTitle('');
    setContent('');
    }else {
      alert('You must be signed in to add notes');
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: '20px',
      textAlign: 'center',
      maxWidth: '600px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
    },
    input: {
      padding: '10px',
      margin: '5px 0',
      fontSize: '16px',
    },
    textarea: {
      padding: '10px',
      margin: '5px 0',
      fontSize: '16px',
      height: '100px',
    },
    button: {
      padding: '10px',
      margin: '10px 0',
      fontSize: '16px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
    notesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }
  };

  return (
    <div style={styles.container}>
    <h1>Note Taking App</h1>
    {user ? (
      <>
        <form onSubmit={addNote} style={styles.form}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea 
            placeholder="Content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          ></textarea>
          <button type="submit" style={styles.button}>Add Note</button>
        </form>
        <div style={styles.notesContainer}>
          {notes.map((note, index) => (
            <Note key={index} title={note.title} content={note.content} />
          ))}
        </div>
        <button onClick={() => auth.signOut()}>Sign Out</button>
      </>
    ) : (
      <>
        <SignIn />
        <SignUp />
      </>
    )}
  </div>
  );
}

export default App;
