import {Book} from "../types/CustomTypes";
import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";
import Api from "../http/Api";

type Props = {
    book: Book | undefined,
    showModal: boolean,
    closeModal: any,
}

export  function AddBook(props: Props) {

    const [title,setTitle] = useState<string>(props.book ? props.book.title : '');
    const [isbn,setIsbn] = useState<string>(props.book ? props.book.isbn : '');
    const [genre,setGenre] = useState<string>(props.book ? props.book.genre : '');
    const [publishedOn,setPublishedOn] = useState<string>(props.book ? props.book.publishedOn?.toString : '');
    const [authorName,setAuthorName] = useState<string>(props.book ? props.book.author.name : '');
    const [publisherName,setPublisherName] = useState<string>(props.book ? props.book.publisher.name : '');

    function handleCloseModal(){
        props.closeModal();
    }

    function onOk(){
        let book = props.book;
        if(!book){
            book = {
                title: title,
                isbn: isbn,
                author: {
                    name: authorName
                },
                publisher: {
                    name: publisherName,
                },
                publishedOn: new Date(publishedOn),
                genre: genre,
                availableToLoan:false,
                id: undefined
            }

            Api.createBook(book).then((response)=>{
                console.log(response);
                if(response.success){
                    props.closeModal(true);
                }
            }).catch((error)=>{
                console.log(error);
                alert(error);
            });
        }
        else{
            book.title = title ? title : book.title;
            book.isbn = isbn ? isbn : book.isbn;
            book.genre = genre ? genre : book.genre;
            book.author.name = authorName ? authorName : book.author.name;
            book.publishedOn = publishedOn ? new Date(publishedOn) : book.publishedOn;
            book.publisher.name = publisherName ? publisherName : book.publisher.name;

            Api.editBook(book).then((response)=>{
                console.log(response);
                if(response){
                    props.closeModal(true);
                }
            }).catch((error)=>{
                console.log(error);
                alert(error);
            });
        }
    }


    return <Modal
        show={props.showModal}
        onHide={handleCloseModal}
        backdrop="static"
    >
        <Modal.Header closeButton>
            <Modal.Title>Add/Update Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="mt-2">
                <p>Give Book Details</p>
            </div>
            <div className="row mt-2">
                <div className="col-6">
                    <div className="form-group">
                        <label>Title</label>
                        <input defaultValue={props.book ? props.book.title : ''} className="form-control" onChange={e => setTitle(e.target.value)}/>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label>Author Name</label>
                        <input defaultValue={props.book ? props.book.author.name : ''} className="form-control" onChange={e => setAuthorName(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-6">
                    <div className="form-group">
                        <label>ISBN</label>
                        <input defaultValue={props.book ? props.book.isbn : ''} className="form-control" onChange={e => setIsbn(e.target.value)}/>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label>Genre</label>
                        <select className="form-control" onChange={e => setGenre(e.target.value)}>
                            <option defaultChecked={props.book && props.book.genre==='Fiction'}>Fiction</option>
                            <option defaultChecked={props.book && props.book.genre==='Science Fiction'}>Science Fiction</option>
                            <option defaultChecked={props.book && props.book.genre==='Science'}>Science</option>
                            <option defaultChecked={props.book && props.book.genre==='History'}>History</option>
                            <option defaultChecked={props.book && props.book.genre==='Literature'}>Literature</option>
                            <option defaultChecked={props.book && props.book.genre==='Religious'}>Religious</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-6">
                    <div className="form-group">
                        <label>Published On</label>
                        <input defaultValue={props.book && props.book.publishedOn ? props.book.publishedOn.toString() : ''} type="date" className="form-control" onChange={e => setPublishedOn(e.target.value)}/>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-group">
                        <label>Publisher</label>
                        <input  defaultValue={props.book ? props.book.publisher.name : ''} type="text" className="form-control" onChange={e => setPublisherName(e.target.value)}/>
                    </div>
                </div>
            </div>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={onOk}>Save</Button>
        </Modal.Footer>

    </Modal>

}