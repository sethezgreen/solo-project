import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Main from './views/Main'
import useToken from './components/useToken'

function App() {
  const { token, setToken } = useToken("")
  const [tokenId, setTokenId] = useState("")
  const [loggedUser, setLoggedUser] = useState({})

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token)
      sessionStorage.setItem('tokenId', decoded.sub.id)
      setTokenId(decoded.sub.id)
      setLoggedUser(decoded.sub)
    }
  },[token])

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Main token={token} setToken={setToken} tokenId={tokenId} setTokenId={setTokenId} loggedUser={loggedUser} setLoggedUser={setLoggedUser} />} />
      </Routes>
    </>
  )
}

export default App
