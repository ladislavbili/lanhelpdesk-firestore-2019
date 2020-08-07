import React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { timestampToString } from '../../helperFunctions';


export default class ExcelExport extends React.Component {
    render() {
      const { filename, invoice } = this.props;
      const data = `
      Fakturačný výkaz firmy
      Firma ${invoice.company.title}
      Obdobie od ${timestampToString(invoice.from)} do: ${timestampToString(invoice.to)}

      Počet prác vrámci paušálu: ${invoice.totalPausalWorks}
      Počet výjazdov vrámci paušálu: ${invoice.totalPausalTrips}
      Práce a výjazdy vrámci paušálu
      Práce
      ID, Názov úlohy, Zadal, Rieši, Status, Close date, Popis práce, Typ práce, Hodiny
      ${ invoice.pausalTasks.map( (task) => `
        ${task.id}
        ` )}
      `
        return (
          <CSVLink
            data={data}
            filename={`${filename}.csv`}
            className="btn btn-link waves-effect"
            target="_blank"
            >
            CSV
          </CSVLink>
        );
    }
}
