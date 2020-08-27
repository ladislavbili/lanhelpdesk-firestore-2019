import React, {Component} from 'react';
import { timestampToString, reduceTasksToIds } from '../../helperFunctions';
import Excel from 'exceljs';
import FileSaver from 'file-saver';
class Test extends Component {

  async downloadExcel(){
    const { filename, invoice } = this.props;
    const h1 = {
      bold: true,
      size: 16,
    };
    const h2 = {
      bold: true,
      size: 14,
    }
    const h3 = {
      bold: true,
    }

    const ws = new Excel.Workbook();
    const sheet = ws.addWorksheet('Vykaz');
    const widthMultiplier = 5;
    sheet.columns = [
      { width: 11 * widthMultiplier },
      { width: 8 * widthMultiplier },
      { width: 4 * widthMultiplier },
      { width: 4 * widthMultiplier },
      { width: 2 * widthMultiplier },
      { width: 3 * widthMultiplier },
      { width: 10 * widthMultiplier },
      { width: 4 * widthMultiplier },
      { width: 2 * widthMultiplier },
      { width: 3 * widthMultiplier },
      { width: 3 * widthMultiplier },
    ];


    sheet.addRows([
      ['Fakturačný výkaz firmy'],
      [`Firma ${invoice.company.title}`,`Počet prác vrámci paušálu: ${invoice.totalPausalWorks}`],
      [`Obdobie od ${timestampToString(invoice.from)} do: ${timestampToString(invoice.to)}`,`Počet výjazdov vrámci paušálu: ${invoice.totalPausalTrips}`],
      [],
      ['Práce a výjazdy vrámci paušálu'],
      ['Práce'],
      ['ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny']
    ])
    this.setMultipleCellsStyle([ 'A1', 'A6' ],h1, sheet);
    this.setMultipleCellsStyle([ 'A5' ],h2, sheet)
    this.setMultipleCellsStyle([ 'A7','B7','C7','D7','E7','F7','G7','H7','I7' ],h3, sheet);

    //Prace
    invoice.pausalTasks.forEach((task) =>{
      sheet.addRows(
        task.works.map((work, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              work.title,
              work.type,
              work.quantity
            ]
          }
          let row = [];
          row[7] = work.title;
          row[8] = work.type;
          row[9] = work.quantity;
          return row;
        })
      );
    })
    sheet.addRow([]);
    sheet.addRow(['Spolu počet hodín:', invoice.pausalInfo.worksTotalTime])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu počet hodín mimo pracovný čas:', invoice.pausalInfo.worksTotalOvertime, `Čísla úloh: ${reduceTasksToIds(invoice.pausalInfo.worksOvertimeTasks)}`
    ])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu prirážka za práce mimo pracovných hodín:', `${invoice.pausalInfo.worksExtraPay} eur`])
    this.setLastRowStyle(['A'], sheet, h3);
    //Koniec Prace
    sheet.addRow([]);

    //Zaciatok vyjazdov
    sheet.addRow(['Výjazdy'])
    this.setLastRowStyle(['A'], sheet, h1);
    sheet.addRow(['ID','Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Výjazd', 'Mn.'])
    this.setLastRowStyle([ 'A','B','C','D','E','F','G','H' ],sheet, h3);
    invoice.pausalTasks.forEach((task) =>{
      sheet.addRows(
        task.trips.map((trip, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              trip.title,
              trip.quantity
            ]
          }
          let row = [];
          row[7] = trip.title;
          row[8] = trip.quantity;
          return row;
        })
      );
    })
    sheet.addRow([]);
    sheet.addRow(['Spolu počet výjazdov:', invoice.pausalInfo.tripsTotalTime])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu počet výjazdov mimo pracovný čas:', invoice.pausalInfo.tripsTotalOvertime, `Čísla úloh: ${reduceTasksToIds(invoice.pausalInfo.tripsOvertimeTasks)}`
    ])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu prirážka za výjazdov mimo pracovných hodín:', `${invoice.pausalInfo.tripsExtraPay} eur`])
    this.setLastRowStyle(['A'], sheet, h3);
    //Koniec vyjazdov
    //PAUSALE KONCIA
    sheet.addRow([]);

    //MIMO PAUSALU
    sheet.addRow(['Práce a výjazdy nad rámec paušálu'])
    this.setLastRowStyle(['A'], sheet, h2);
    //Zaciatok - Prace
    sheet.addRow(['Práce'])
    this.setLastRowStyle(['A'], sheet, h1);
    sheet.addRow(['ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny', 'Cena/hodna', 'Cena spolu'])
    this.setLastRowStyle([ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ],sheet, h3);

    invoice.pausalExtraTasks.forEach((task) =>{
      sheet.addRows(
        task.works.map((work, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              work.title,
              work.type,
              work.quantity,
              work.unitPrice,
              work.totalPrice,
            ]
          }
          let row = [];
          row[7] = work.title;
          row[8] = work.type;
          row[9] = work.quantity;
          row[10] = work.unitPrice;
          row[11] = work.totalPrice;
          return row;
        })
      );
    })
    sheet.addRow([]);

    sheet.addRow(['Spolu počet hodín:', invoice.pausalExtraInfo.worksTotalTime])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu počet hodín mimo pracovný čas:', invoice.pausalExtraInfo.worksTotalOvertime, `Čísla úloh: ${
    reduceTasksToIds(invoice.pausalExtraInfo.worksOvertimeTasks)}`
    ])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu prirážka za práce mimo pracovných hodín:', `${invoice.pausalExtraInfo.worksExtraPay} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena bez DPH:', `${invoice.pausalExtraInfo.worksPriceWithoutDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena s DPH:', `${invoice.pausalExtraInfo.worksPriceWithDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);
    //Koniec - Prace
    sheet.addRow([]);
    //Zaciatok - Vyjazdy
    sheet.addRow(['Výjazdy'])
    this.setLastRowStyle(['A'], sheet, h1);
    sheet.addRow(['ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Výjazd', 'Mn.', 'Cena/ks', 'Cena spolu'])
    this.setLastRowStyle([ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],sheet, h3);
    invoice.pausalExtraTasks.forEach((task) =>{
      sheet.addRows(
        task.trips.map((trip, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              trip.title,
              trip.quantity,
              trip.unitPrice,
              trip.totalPrice,
            ]
          }
          let row = [];
          row[7] = trip.title;
          row[8] = trip.quantity;
          row[9] = trip.unitPrice;
          row[10] = trip.totalPrice;
          return row;
        })
      );
    })
    sheet.addRow([]);

    sheet.addRow(['Spolu počet výjazdov:', invoice.pausalExtraInfo.tripsTotalTime])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu počet výjazdov mimo pracovný čas:', invoice.pausalExtraInfo.tripsTotalOvertime, `Čísla úloh: ${
    reduceTasksToIds(invoice.pausalExtraInfo.tripsOvertimeTasks)}`
    ])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu prirážka za výjazdy mimo pracovných hodín:', `${invoice.pausalExtraInfo.tripsExtraPay} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena bez DPH:', `${invoice.pausalExtraInfo.tripsPriceWithoutDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena s DPH:', `${invoice.pausalExtraInfo.tripsPriceWithDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);
    //Koniec - Vyjazdy
    //MIMO PAUSALU KONCI
    sheet.addRow([]);

    //PROJEKTOVE ULOHY
    sheet.addRow(['Projektové práce a výjazdy'])
    this.setLastRowStyle(['A'], sheet, h2);
    //Zaciatok - Prace
    sheet.addRow(['Práce'])
    this.setLastRowStyle(['A'], sheet, h1);
    sheet.addRow(['ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny', 'Cena/hodna', 'Cena spolu'])
    this.setLastRowStyle([ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ],sheet, h3);

    invoice.projectTasks.forEach((task) =>{
      sheet.addRows(
        task.works.map((work, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              work.title,
              work.type,
              work.quantity,
              work.unitPrice,
              work.totalPrice,
            ]
          }
          let row = [];
          row[7] = work.title;
          row[8] = work.type;
          row[9] = work.quantity;
          row[10] = work.unitPrice;
          row[11] = work.totalPrice;
          return row;
        })
      );
    })
    sheet.addRow([]);

    sheet.addRow(['Spolu počet hodín:', invoice.projectInfo.worksTotalTime])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu počet hodín mimo pracovný čas:', invoice.projectInfo.worksTotalOvertime, `Čísla úloh: ${
    reduceTasksToIds(invoice.projectInfo.worksOvertimeTasks)}`
    ])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu prirážka za práce mimo pracovných hodín:', `${invoice.projectInfo.worksExtraPay} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena bez DPH:', `${invoice.projectInfo.worksPriceWithoutDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena s DPH:', `${invoice.projectInfo.worksPriceWithDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);
    //Koniec - Prace
    sheet.addRow([]);
    //Zaciatok - Vyjazdy
    sheet.addRow(['Výjazdy'])
    this.setLastRowStyle(['A'], sheet, h1);
    sheet.addRow(['ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Výjazd', 'Mn.', 'Cena/ks', 'Cena spolu'])
    this.setLastRowStyle([ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],sheet, h3);
    invoice.projectTasks.forEach((task) =>{
      sheet.addRows(
        task.trips.map((trip, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              trip.title,
              trip.quantity,
              trip.unitPrice,
              trip.totalPrice,
            ]
          }
          let row = [];
          row[7] = trip.title;
          row[8] = trip.quantity;
          row[9] = trip.unitPrice;
          row[10] = trip.totalPrice;
          return row;
        })
      );
    })
    sheet.addRow([]);

    sheet.addRow(['Spolu počet výjazdov:', invoice.projectInfo.tripsTotalTime])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu počet výjazdov mimo pracovný čas:', invoice.projectInfo.tripsTotalOvertime, `Čísla úloh: ${
    reduceTasksToIds(invoice.projectInfo.tripsOvertimeTasks)}`
    ])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu prirážka za výjazdy mimo pracovných hodín:', `${invoice.pausalExtraInfo.tripsExtraPay} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena bez DPH:', `${invoice.pausalExtraInfo.tripsPriceWithoutDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow(['Spolu cena s DPH:', `${invoice.pausalExtraInfo.tripsPriceWithDPH} eur`])
    this.setLastRowStyle(['A'], sheet, h3);
    //Koniec - Vyjazdy
    //Projetky KONCIA
    sheet.addRow([])

    // MATERIALE
    sheet.addRow(['Materiále a voľné položky'])
    this.setLastRowStyle(['A'], sheet, h2);
    sheet.addRow(['ID', 'Názov', 'Zadal', 'Rieši', 'Status', 'Close date', 'Material', 'Mn.', 'Jednotka', 'Cena/Mn.', 'Cena spolu'])
    this.setLastRowStyle([ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ],sheet, h3);
    invoice.materialTasks.forEach((task) =>{
      sheet.addRows(
        task.materials.map((material, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              material.title,
              material.quantity,
              material.unit,
              material.unitPrice,
              material.totalPrice,
            ]
          }
          let row = [];
          row[7] = material.title;
          row[8] = material.quantity;
          row[9] = material.unit;
          row[10] = material.unitPrice;
          row[11] = material.totalPrice;
          return row;
        })
      );
      sheet.addRows(
        (task.customItems?task.customItems:[]).map((customItem, index) => {
          if( index === 0 ){
            return [
              task.id,
              task.title,
              task.requester,
              task.assignedTo.reduce( (acc, item) => acc + item + '\n' ,""),
              task.status.title,
              timestampToString(task.closeDate),
              customItem.title,
              customItem.quantity,
              customItem.unit,
              customItem.unitPrice,
              customItem.totalPrice,
            ]
          }
          let row = [];
          row[7] = customItem.title;
          row[8] = customItem.quantity;
          row[9] = customItem.unit;
          row[10] = customItem.unitPrice;
          row[11] = customItem.totalPrice;
          return row;
        })
      );
    })
    sheet.addRow([]);

    sheet.addRow([ 'Spolu cena bez DPH:', `${invoice.materialInfo.priceWithoutDPH} EUR`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow([ 'Spolu cena s DPH:', `${invoice.materialInfo.priceWithDPH} EUR`])
    this.setLastRowStyle(['A'], sheet, h3);
    sheet.addRow([]);

    //SLUZBY
    sheet.addRow(['Mesačný prenájom služieb a harware'])
    this.setLastRowStyle(['A'], sheet, h2);
    sheet.addRow(['Názov', 'Mn.', 'Cena/ks/mesiac', 'Cena spolu/mesiac'])
    this.setLastRowStyle([ 'A', 'B', 'C', 'D' ],sheet, h3);
    sheet.addRows(
      invoice.rented.map((rentedItem) => [
        rentedItem.title,
        rentedItem.quantity,
        rentedItem.unitPrice,
        rentedItem.totalPrice
      ])
    )
    sheet.addRow([]);
    sheet.addRow([ 'Spolu cena bez DPH:', `${invoice.rentedInfo.priceWithoutDPH} EUR`])
    this.setLastRowStyle(['A'], sheet, h3);

    sheet.addRow([ 'Spolu cena s DPH:', `${invoice.rentedInfo.priceWithDPH} EUR`])
    this.setLastRowStyle(['A'], sheet, h3);


    //STIAHNUTE
    ws.xlsx.writeBuffer()
    .then(buffer => FileSaver.saveAs(new Blob([buffer]), `${filename}.xlsx`))
  }

  setLastRowStyle( range, sheet, style ){
    range.forEach((letter)=>{
      sheet.getCell(`${letter}${sheet.rowCount}`).font = style;
    })
  }

  mergerLastRow( range, sheet ){
    sheet.mergeCells(`${range[0]}${sheet.rowCount}:${range[1]}${sheet.rowCount}`);
  }

  setMultipleCellsStyle( cells, style, sheet ){
    cells.forEach((cell)=>{
      sheet.getCell(`${cell}`).font = style;
    })
  }

  render() {

    return (
      <button className="btn btn-link waves-effect" onClick={this.downloadExcel.bind(this)}>Excel</button>
    );
  }
}

export default Test
