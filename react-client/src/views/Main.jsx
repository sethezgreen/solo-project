import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/main.css'
import MainFeed from '../components/MainFeed'
import ViewRecipe from '../components/ViewRecipe'
import ViewUser from '../components/ViewUser'
import SideNav from '../components/SideNav'
import RecipeForm from '../components/RecipeForm'
import LoginRegModal from '../components/LoginRegModal'
import Bookmarks from '../components/Bookmarks'

const Main = (props) => {
    const {token, setToken, tokenId, setTokenId, loggedUser, setLoggedUser} = props
    const [recipeId, setRecipeId] = useState("")
    const [userId, setUserId] = useState("")
    const [modal, setModal] = useState(false)
    const [creating, setCreating] = useState(false)
    const [followedUsers, setFollowedUsers] = useState([])
    const [viewingBookmarks, setViewingBookmarks] = useState(false)
    const [bookmarks, setBookmarks] = useState([])

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:5000/api/users/bookmarks', {headers: {Authorization: `Bearer ${token}`}})
                .then((res) => {
                    console.log(res)
                    setBookmarks(res.data)
                })
                .catch((err) => console.log(err))
        }
    },[token])

    const toggleModal = () => {
        setModal(!modal)
    }

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    const logoutCallback = () => {
        setToken("")
        setTokenId("")
        setRecipeId("")
        setUserId("")
        setLoggedUser({})
        setFollowedUsers([])
        alert("logout successful")
    }

    return (
        <div className='main-view'>
            <div id='border'></div>
            <div className='main-content'>
            <SideNav token={token} toggleModal={toggleModal} logoutCallback={logoutCallback} loggedUser={loggedUser} setUserId={setUserId} followedUsers={followedUsers} setFollowedUsers={setFollowedUsers} setViewingBookmarks={setViewingBookmarks}/>
            {
                creating?
                <div className='content-div'>
                    <div className='content-header-container'>
                        <button onClick={()=> setCreating(false)} className='content-header'>Back to Feed</button>
                    </div>
                    <RecipeForm token={token} setCreating={setCreating}/>
                </div>:
                recipeId?
                <div className='content-div'>
                    <div className='content-header-container'>
                        <button onClick={()=> setRecipeId("")} className='content-header'>Back to Feed</button>
                    </div>
                    <ViewRecipe recipeId={recipeId} token={token} tokenId={tokenId} setRecipeId={setRecipeId} setUserId={setUserId}/>
                </div>:
                userId?
                <div className='content-div'>
                    {/* <div className='content-header-container'>
                        
                    </div> */}
                    <ViewUser id={userId} setUserId={setUserId} setRecipeId={setRecipeId} tokenId={tokenId} token={token} followedUsers={followedUsers} setFollowedUsers={setFollowedUsers}/>
                </div>:
                viewingBookmarks?
                <div className='content-div'>
                    <div className='content-header-container'>
                        <button onClick={()=> setViewingBookmarks(false)} className='content-header'>Back to Feed</button>
                        <Bookmarks recipes={bookmarks}/>
                    </div>
                </div>:
                <div className='content-div'>
                    <div className='content-header-container'>
                        <header className='content-header'>
                            {/* <h3 className='background-border-rad primary'>Feed</h3> */}
                            <h3 className=''>Feed</h3>
                            {
                                token?
                                <button onClick={() => setCreating(true)} className='background-border-rad accent pointer-hover mobile-hidden'>post recipe</button>:
                                <button onClick={() => toggleModal()} className='background-border-rad accent mobile-hidden'>Log in to post a recipe</button>
                            }
                        </header>
                    </div>
                    <MainFeed token={token} setRecipeId={setRecipeId} setUserId={setUserId}/>
                </div>
            }
            </div>

            {
                modal && (
                    <LoginRegModal setToken={setToken} toggleModal={toggleModal}/>
                )
            }
        </div>
    )
}

export default Main