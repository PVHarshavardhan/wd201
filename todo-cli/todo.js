const todoList = () => {
  const all = []
  const add = (todoItem) => {
    all.push(todoItem)
  }
  const markAsComplete = (index) => {
    all[index].completed = true
  }

  const overdue = () => {
    const over = []
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate < today) {
        over.push(all[i])
      }
    }
    return over
  }

  const dueToday = () => {
    const duetoday = []
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate === today) {
        duetoday.push(all[i])
      }
    } return duetoday
  }

  const dueLater = () => {
    const duelater = []
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate > today) {
        duelater.push(all[i])
      }
    }
    return duelater
  }

  const toDisplayableList = (list) => {
    let string = ''
    for (let i = 0; i < list.length; i++) {
      if (list[i].dueDate === today) {
        if (list[i].completed === true) {
          string += ('[x] ' + list[i].title) + '\n'
        } else {
          string += ('[ ] ' + list[i].title) + '\n'
        }
      } else {
        if (list[i].completed === true) {
          string += ('[x] ' + list[i].title + ' ' + list[i].dueDate.toString()) + '\n'
        } else {
          string = string + ('[ ] ' + list[i].title + ' ' + list[i].dueDate.toString()) + '\n'
        }
      }
    } return string.slice(0, string.length - 1)
  }; return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  }
}
module.exports = todoList

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

const todos = todoList()
const formattedDate = d => {
  return d.toISOString().split('T')[0]
}

const dateToday = new Date()
const today = formattedDate(dateToday)
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
)
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
)

todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
todos.add({ title: 'Pay rent', dueDate: today, completed: true })
todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })

console.log('My Todo-list\n')

console.log('Overdue')
var overdues = todos.overdue()
var formattedOverdues = todos.toDisplayableList(overdues)
console.log(formattedOverdues)
console.log('\n')

console.log('Due Today')
let itemsDueToday = todos.dueToday()
let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
console.log(formattedItemsDueToday)
console.log('\n')

console.log('Due Later')
let itemsDueLater = todos.dueLater()
let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
console.log(formattedItemsDueLater)
console.log('\n\n')
