import axios from 'axios'
import React, { useEffect, useState } from 'react'

const UpdateRecipe = (props) => {
    const {token, userId, recipeId, setEditing} = props
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [directions, setDirections] = useState("")
    const [prepTime, setPrepTime] = useState("")
    const [cookTime, setCookTime] = useState("")
    const [creatorId, setCreatorId] = useState("")
    const [errors, setErrors] = useState([])
    
    useEffect(() => {
        axios.get(`http://localhost:5000/api/recipes/${recipeId}`)
            .then((res) => {
                setTitle(res.data.title)
                setDescription(res.data.description)
                setIngredients(res.data.ingredients)
                setDirections(res.data.directions)
                setPrepTime(res.data.prep_time)
                setCookTime(res.data.cook_time)
                setCreatorId(res.data.user_id)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()

        const updatedRecipe = {
            "recipe_id": recipeId,
            title,
            description,
            ingredients,
            directions,
            'prep_time': prepTime,
            'cook_time': cookTime,
            'user_id': creatorId
        }
        axios.post("http://localhost:5000/api/recipes/update", updatedRecipe, {headers: {Authorization: `Bearer ${token}`}})
            .then((res) => {
                console.log(res)
                setEditing(false)
            })
            .catch((err) => {
                console.log(err)
                setErrors(err.response.data)
            })
    }
    
    return (
        <div>
            <button onClick={() => setEditing(false)} type='button'>Back to {title}</button>
            <h1>Update {title}</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title || ""} onChange={(e) => setTitle(e.target.value)}/>
                    {
                        errors.title?
                        <p>{errors.title}</p>:
                        null
                    }
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={description || ""} onChange={(e) => setDescription(e.target.value)}/>
                    {
                        errors.description?
                        <p>{errors.description}</p>:
                        null
                    }
                </div>
                <div>
                    <label>Ingredients:</label>
                    <input type="text" value={ingredients || ""} onChange={(e) => setIngredients(e.target.value)}/>
                    {
                        errors.ingredients?
                        <p>{errors.ingredients}</p>:
                        null
                    }
                </div>
                <div>
                    <label>Directions:</label>
                    <input type="text" value={directions || ""} onChange={(e) => setDirections(e.target.value)}/>
                    {
                        errors.directions?
                        <p>{errors.directions}</p>:
                        null
                    }
                </div>
                <div>
                    <label>Prep Time:</label>
                    <input type="number" value={prepTime || ""} onChange={(e) => setPrepTime(e.target.value)}/>
                    {
                        errors.prepTime?
                        <p>{errors.prepTime}</p>:
                        null
                    }
                </div>
                <div>
                    <label>Cook Time:</label>
                    <input type="number" value={cookTime || ""} onChange={(e) => setCookTime(e.target.value)}/>
                    {
                        errors.cookTime?
                        <p>{errors.cookTime}</p>:
                        null
                    }
                </div>
                <input type="submit" value="Update" />
            </form>
        </div>
    )
}

export default UpdateRecipe