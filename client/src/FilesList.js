import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "./FilesList.css";

export default function FilesList() {

	const [csvList, setCSVList] = useState([]);

	const fetchAPI = async () => {
		const fetched = await fetch("http://localhost:3500/files/data");
		if (fetched.ok) {
			setCSVList(await fetched.json());
		}
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
	);
}
