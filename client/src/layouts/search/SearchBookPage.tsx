import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import SpinerLoading from "../utils/SpinnerLoading";
import SearchBook from "./components/SearchBook";
import Pagination from "../utils/Pagination";

const SearchBookPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookPerPage, setBookPerPage] = useState(5);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPage] = useState(0);
    const [search, setSearch] = useState("");
    const [searchUrl, setSearchUrl] = useState("");


    useEffect(() => {
        setIsLoading(true);
        fetchSearch().then(() => {
            window.scrollTo(0, 0);
        }).catch((err) => setHttpError(err.message)).finally(() => {
            setIsLoading(false);
        });
    }, [currentPage, searchUrl]);

    const fetchSearch = async () => {
        const baseUrl: string = "http://localhost:8080/api/books";
        let url: string = `${baseUrl}?page=${currentPage - 1}&size=${bookPerPage}`;

        if (searchUrl === '') {
            url = `${baseUrl}?page=${currentPage - 1}&size=${bookPerPage}`;
        } else {
            url = `${baseUrl}${searchUrl}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Some thing went wrong");

        const responseJson = await response.json();
        const data = responseJson._embedded.books;
        const loadedBooks: BookModel[] = [];
        for (let key of data) {
            loadedBooks.push({
                id: key.id,
                title: key.title,
                author: key.author,
                description: key.description,
                copies: key.copies,
                copiesAvaliable: key.copiesAvaliable,
                img: key.img
            });
        }

        setBooks(loadedBooks);

        console.log(responseJson)

        setTotalBooks(responseJson.page.totalElements);
        setTotalPage(responseJson.page.totalPages);
    }

    if (httpError) return (
        <>
            <p>{httpError}</p>  
        </>
    );

    if (isLoading) return <SpinerLoading />

    const searchHandle = () => {
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=0&size=${bookPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * bookPerPage;
    const indexOfFirstBook: number = indexOfLastBook - bookPerPage;
    let lastItem = bookPerPage * currentPage <= totalBooks ? bookPerPage * currentPage : totalBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <div>
                <div className="container">
                    <div>
                        <div className="row mt-5">
                            <div className="col-6">
                                <div className="d-flex">
                                    <input type="search" className="form-control me-2" placeholder="search" area-labelledby="Search" value={search} onChange={e => setSearch(e.target.value)}/>
                                    <button className="btn btn-outline-success" onClick={searchHandle}>
                                        Search
                                    </button>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="dropdown">
                                    <button 
                                        className="btn btn-secondary dropdown-toggle" 
                                        type="button" 
                                        id="dropdownMenuButton1" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        Category 
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li>
                                            <a className="dropdown-item" href="#">All</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">Frontend</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">Backend</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">Data</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">DevOps</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h5>Number of results: ({totalBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalBooks} items
                            </p>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                            {totalPages > 1 && (
                                <Pagination currentPage={currentPage} totalPage={totalPages} paginate={paginate}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchBookPage;