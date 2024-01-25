import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Person from './components/person'
import Notification from './components/notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialResponse => {
        setPersons(initialResponse)
      })
  }, [])

  const contactsToShow = filterString === '' 
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterString.toLowerCase()))

  const newContact = (event) => {
    event.preventDefault()
    const contactObject = { 
      name: newName,
      number: newNumber
    }
    for (let person in persons) {
      if (persons[person].number === contactObject.number) {
        alert(`This nubmer is already in system`)
        return 
      }

      if (persons[person].name === contactObject.name) {
        if (confirm(`${contactObject.name} is already added to phonebook, replace the old number with a new one?`)) {
          const changedContact = {...persons[person], number: contactObject.number} 
          setTimeout(() => setSuccessMessage(null), 5000)
          personsService
          .update(persons[person].id, changedContact)
          .then(initialResponse => {
                setSuccessMessage("Contact's number updated successfully")
                setPersons(persons.map(p => p.id === changedContact.id ? initialResponse : p))
              })
            .catch(error => {
              setErrorMessage(`${contactObject.name} has already been deleted`)
              setTimeout(() => setErrorMessage(null), 5000)
              setPersons(persons.filter(p => p.id !== changedContact.id))
            })
          setNewName("")
          setNewNumber("")
          return 
        } else {
          return
        }
      }
    }

    personsService
      .create(contactObject)
      .then(initialResponse => {
        console.log(initialResponse)
        setPersons(persons.concat(initialResponse))
      })
    setSuccessMessage(`Added ${contactObject.name}`)
    setTimeout(() => setSuccessMessage(null), 5000)
    setNewName("")
    setNewNumber("")
  }

  const removeContact = (id, name) => {
    if (confirm(`Are you sure you want to delete ${name}`)) {
        personsService.remove(id)
        // axios
        //     .delete(`http://localhost:3001/persons/${id}`)
        //     .then(response => console.log(response))
        
        setPersons(persons.filter(person => person.id !== id))
    } else {
        return
    }
}

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilterString(event.target.value)
  }

  let messageToShow = successMessage || errorMessage

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={messageToShow} type={(errorMessage ? 'error' : 'success')}/>
      filter shown with <input value={filterString} onChange={handleFilterInput} />
      <form onSubmit={newContact}>
        <div>
          name: <input value={newName} onChange={handleNameInput} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {contactsToShow.map(person => 
        <Person 
          name={person.name} 
          number={person.number} 
          key={person.id} 
          removeContact={() => removeContact(person.id, person.name)} 
        />    
      )}
      {/* <Persons persons={contactsToShow} /> */}
    </div>
  )
}

export default App