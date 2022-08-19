import React, {useCallback, useEffect, useState} from "react";
import {Book, Loan, Member} from "../../types/CustomTypes";
import {NavLink, useParams} from "react-router-dom";
import {Button, Card, Modal, Nav, Spinner, Table} from "react-bootstrap";
import TopNav from "../../layout/TopNav";
import Api from "../../http/Api";

type State = {
    book: Book | undefined,
    loading: boolean
}


export function ViewBook(props: any){
    let {bookId} = useParams();
    const [book, setBook] = useState<Book>();
    const [loading, setLoading] = useState<boolean>(true);
    const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
    const [loanHistory, setLoanHistory] = useState<Loan[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<number>(-1);
    const [memberName, setMemberName] = useState<string>();
    const [memberAddress, setMemberAddress] = useState<string>();
    const [dueDate, setDueDate] = useState<any>();
    const [fee, setFee] = useState<any>(0);

    function getBookById(bookId: any) {
        Api.getBookById(bookId as number)
            .then((response)=>{
                setBook(response);
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            .finally(()=>{
                setLoading(false);
            });
    }

    function getLoanHistory(bookId: any) {
        Api.getLoanHistoryByBookId(bookId as number)
            .then((response)=>{
                setLoanHistory(response);
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            });
    }

    function getMembers() {
        Api.getMembers()
            .then((response)=>{
                setMembers(response);
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            });
    }


    function returnBook(loanId: number){
        Api.returnBookByLoanId(loanId)
            .then((response)=>{
                console.log(response);
                if(response){

                    setLoanHistory(
                        loanHistory.map((item)=>{
                            if(item.id===response.id){
                                return response;
                            }
                            return item;
                        })
                    );
                    book!.availableToLoan = true;
                    setBook(
                        book
                    )
                }
            })
            .catch((error)=>{
               console.log(error);
            });
    }

    useEffect(() => {
        console.log(bookId);
        getBookById(bookId);
        getLoanHistory(bookId);
        getMembers();
    }, [bookId]);

    function handleCloseModal() {
        setShowLoanModal(false);
    }

    function lendBook() {
        let request: any = {
            dueDate: dueDate,
            fee: fee
        }
        if(selectedMember!=-1 && selectedMember!=0){
            //means member is selected, find from list and attach in request
            request.loanedToMember = members.find(x => x.id==selectedMember);
        }
        else{
            request.loanedToMember = {name: memberName, address: memberAddress}
        }
        console.log(request);
        Api.loanBookToMember(request,bookId)
            .then((response)=>{
                console.log(response)
                if(response){
                    getBookById(bookId);
                    getLoanHistory(bookId);
                }
            })
            .catch((error)=>{
               console.log(error);
            });
        setShowLoanModal(false);
    }

    function handleMemberChange(value: any) {
        setSelectedMember(value as number);

    }

    function loanModal() {
      return <Modal
          show={showLoanModal}
          onHide={handleCloseModal}
          backdrop="static"
      >
          <Modal.Header closeButton>
              <Modal.Title>Lend Book to Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <select className="form-control" onChange={e=>handleMemberChange(e.target.value)}>
                  <option value={-1}>Select Member</option>
                  <option value={0}>--Add New Member--</option>
                  {
                      members.map((item)=>{
                          return <option value={item.id}>{item.name}</option>
                      })
                  }
              </select>
              {
                  selectedMember==0 &&
                  <div>
                      <div className="mt-2">
                          <p>Give member Details</p>
                      </div>
                      <div className="row mt-2">
                          <div className="col-6">
                              <div className="form-group">
                                  <label>Member Name</label>
                                  <input className="form-control" onChange={e => setMemberName(e.target.value)}/>
                              </div>
                          </div>
                          <div className="col-6">
                              <div className="form-group">
                                  <label>Member Address</label>
                                  <input className="form-control" onChange={e => setMemberAddress(e.target.value)}/>
                              </div>
                          </div>
                      </div>
                  </div>
              }
              {
                  selectedMember!=-1 &&
                  <div className="row mt-2">
                      <div className="col-6">
                          <div className="form-group">
                              <label>Due Date</label>
                              <input type="date" className="form-control" onChange={e => setDueDate(e.target.value)}/>
                          </div>
                      </div>
                      <div className="col-6">
                          <div className="form-group">
                              <label>Fee</label>
                              <input type="number" className="form-control" onChange={e => setFee(e.target.value)}/>
                          </div>
                      </div>
                  </div>
              }
          </Modal.Body>

          <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
              <Button variant="primary" onClick={lendBook}>Lend Book</Button>
          </Modal.Footer>

      </Modal>
    }

    return (
        <div>
            <TopNav/>
            {
                loading ?
                <div className="d-flex justify-content-center align-items-center m-5">
                    <Spinner animation="border" />
                </div>
                    :
                    <Card className="m-5">
                        <Card.Body>
                            {
                                book ?
                                    <div>
                                        <Card.Title >{book.title}</Card.Title>

                                        <div className={"mt-2"}>
                                            <div><span><b>ISBN:</b> {book.isbn}</span></div>
                                            <div><span><b>Author:</b> {book.author?.name}</span></div>
                                            <div><span><b>Publisher:</b> {book.publisher?.name}</span></div>
                                            <div><span><b>Publisher On:</b> {book.publishedOn.toString()}</span></div>
                                        </div>
                                        {
                                            book.availableToLoan &&
                                            <div className={"mt-2"}>
                                                <Button onClick={()=>{setShowLoanModal(true);}}>Lend To Member</Button>
                                            </div>
                                        }


                                        <div className={"mt-3"}>
                                            <h6>Lending History</h6>

                                            <div className="mt-2">
                                                <Table striped bordered hover>
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Member Name</th>
                                                        <th>Lend On</th>
                                                        <th>Due Date</th>
                                                        <th>Returned Date</th>
                                                        <th>Fee</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        loanHistory.map((item: Loan, index) => {
                                                            return <tr key={item.id}>
                                                                <td>{item.id}</td>
                                                                <td>{item.loanedToMemberName}</td>
                                                                <td>{item.loanedAt.toString()}</td>
                                                                <td>{item.dueDate.toString()}</td>
                                                                <td>{item.returnedOn ? item.returnedOn.toString() :
                                                                    <Button size="sm" onClick={()=>{returnBook(item.id);}}>Collect It</Button>
                                                                }</td>
                                                                <td>{item.fee}</td>
                                                            </tr>
                                                        })
                                                    }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                        {
                                            loanModal()
                                        }
                                    </div>
                                    :
                                    <Card.Title className="text-danger">No book found!</Card.Title>


                            }
                        </Card.Body>
                    </Card>
            }




        </div>
    );
}
