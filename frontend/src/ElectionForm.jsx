import React from 'react'
import GeneralUtil from './util/general-util'
import { withRouter } from 'react-router-dom'
import Candidates from './Candidates'
export class ElectionForm extends React.Component{

    constructor(props){
        super()
        this.candidates = [
            {name: 'Tjad', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Martins', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Demmy', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Nurudeen', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Emmanuel', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Favour', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Alois', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Sunday', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
            {name: 'Howard', id: GeneralUtil.uuidv4(), key: GeneralUtil.clashid()}, 
        ]
        this.election = props.location.state.election;
    }

    render(){

        let button;
        
        if(this.election.id ){
            button = <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={this.updateElection}>Update</button>
        }
        else{
            button = <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={this.createElection}>Create</button>
        }

        return(
            <div className="election">
                <label>Name: </label>
                <input type="text" value={this.election.name} onChange={this.handleChangeName}/>
                {button}                
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={this.gotoBallot}>Vote</button>
                { this.election.id
                    ? <Candidates can_register={this.election.phase != 'Candidate'} candidates={this.candidates}></Candidates>
                    : ''
                }
            </div>
            
        )
    }

    createElection = ()=>{
        this.election.id = GeneralUtil.uuidv4()
        alert(this.election.name + ' has been created with id '+ this.election.id)
        this.setState({}) //Call setstate to re-render UI
    }
    updateElection = ()=>{
        alert(this.election.name + ' has been updated')
    }

    handleChangeName = (event)=>{
        this.election.name = event.target.value
        this.setState({}) //Call setstate to re-render UI
    }

    gotoBallot = ()=>{
        this.props.history.push('/ballot', {election: this.election, candidates: this.candidates })
    }
} 
export default withRouter(ElectionForm);