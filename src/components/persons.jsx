import Person from './person'
import axios from 'axios'


const Persons = ( {persons} ) => {
    const removeContact = (id, name) => {
        if (confirm(`Are you sure you want to delete ${name}`)) {
            axios
                .delete(`http://localhost:3001/persons/${id}`)
                .then(response => console.log(response))
            
            persons.filter(person => person.id !== id)
        } else {
            return
        }
    }

    return (
        persons.map(person => 
            <Person name={person.name} number={person.number} key={person.id} removeContact={() => removeContact(person.id, person.name)} />    
        )
    )
}

export default Persons