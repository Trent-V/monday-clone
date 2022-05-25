import { useState, useEffect, useContext } from 'react'

import TicketCard from '../components/TicketCard'
import axios from 'axios'
import CategoriesContext from '../context'

const Dashboard = () => {
    const [tickets, setTickets] = useState(null)
    const { categories, setCategories } = useContext(CategoriesContext)

    function order(a, b) {
        return a < b ? -1 : (a > b ? 1 : 0);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('http://localhost:8000/tickets')

            const dataObject = response.data.data
            
            const arrayOfKeys = Object.keys(dataObject)
            const arrayOfData = Object.keys(dataObject).map((key) => dataObject[key])
            const formattedArray = []
            arrayOfKeys.forEach((key, index) => {
                const formattedData = {...arrayOfData[index]}
                formattedData['documentId'] = key
                formattedArray.push(formattedData)
            },
            // console.log("arrayOfKeys", arrayOfKeys)
            // console.log("arrayOfData", arrayOfData)
            // console.log(formattedArray)
            
            setTickets(formattedArray)

            )}
            fetchData()
    }, [])

    useEffect(() => {
        setCategories([...new Set(tickets?.map(({ category }) => category))])
    }, [tickets, setCategories])
    // WILL GET INFINITE CALLS IF [] IS NOT PROVIDED ***
    
    console.log(categories)

    const colors = [
        'rgb(255,179,186)',
        'rgb(255,223,186)',
        'rgb(255,255,186)',
        'rgb(186,255,201)',
        'rgb(186,255,255)'
    ]

    // **PROVIDES TICKET-CONTAINER UNIQUE CATEGORIES TO MAP**
    const uniqueCategories = [
        ...new Set(tickets?.map(({ category}) => category).sort(order))
    ]


    return (
        <div className="dashboard">
            <h1>My Projects</h1>
            <div className="ticket-container">
                {tickets && uniqueCategories?.map((uniqueCategory, categoryIndex) => (
                    <div key={categoryIndex}>
                        <h3>{uniqueCategory}</h3>
                        {tickets.filter(ticket => ticket.category === uniqueCategory).sort((a,b) => a.timeM > b.timeM ? 1:-1)
                            .map((filteredTicket, _index) => (
                                <TicketCard
                                    key={_index}
                                    id={_index}
                                    color={colors[categoryIndex] || colors[0]}
                                    ticket={filteredTicket}
                                />
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
        
    )

}

export default Dashboard