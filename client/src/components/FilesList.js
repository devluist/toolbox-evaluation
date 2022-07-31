import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./FilesList.css";

const API_URL = "http://localhost:3500/files/data";

export default function FilesList() {

	const [csvList, setCSVList] = useState([]);
	const [query, setQuery] = useState(null);

	const fetchAPI = async (query = null) => {
		let API = API_URL;
		if(query){
			API += ("?fileName=" + query)
		}

		try {
			const fetched = await fetch(API);
			if (fetched.ok) {
				// since I added a single object response when specific file is request
				// I need now to return as an array that single object, to ease table building procedure
				if(query)
					setCSVList([await fetched.json()]);
				else
					setCSVList(await fetched.json());
			}	
		} catch (err) {
			setCSVList([])
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		fetchAPI(query);
		setQuery(null);
	}

	useEffect(() => {
		fetchAPI();
	}, [])

	const renderedList = csvList.map( file => {
			return file.lines.map( line =>
				<tr>
					<td>{ file.file }</td>
					<td>{ line.text }</td>
					<td>{ line.number }</td>
					<td>{ line.hex }</td>
				</tr>
			)
		});

	return (
		<>
			<div className='form-container'>
				<Form className='query-input' onSubmit={handleSubmit}>
					<Form.Control onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Enter file name" value={query} />
					<Button variant="primary" type="submit">
						Search
					</Button>
				</Form>
			</div>
			<div className="table-container">
				<Table className="table" striped bordered>
					<thead>
						<tr>
							<th>File Name</th>
							<th>Text</th>
							<th>Number</th>
							<th>Hex</th>
						</tr>
					</thead>
					<tbody>
						{renderedList}
					</tbody>
				</Table>
			</div>
		</>
	);
}
