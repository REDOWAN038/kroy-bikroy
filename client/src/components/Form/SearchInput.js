import React, { useRef, useEffect } from "react"
import { useSearch } from "../../context/SearchContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai"

const SearchInput = () => {
  const searchInputRef = useRef(null)

  const [search, setSearch] = useSearch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${search.keyword}`
      )
      setSearch({ ...search, results: data })
      navigate(`/search?product_name=${search.keyword}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    searchInputRef.current.focus()
  }, [])

  return (
    <>
      <form role='search' onSubmit={handleSubmit}>
        <div className='search-box'>
          <input
            type='text'
            placeholder='Enter the product name...'
            ref={searchInputRef}
            className='search-input'
            value={search.keyword}
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
            // onSubmit={() => handleSubmit()}
          />
          <div className='search-icon'>
            <AiOutlineSearch />
          </div>
        </div>
        {/* <input
          className='form-control me-2'
          type='search'
          placeholder='Search'
          aria-label='Search'
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
        />
        <button className='btn btn-outline-success' type='submit'>
          Search
        </button> */}
      </form>
    </>
  )
}

export default SearchInput
