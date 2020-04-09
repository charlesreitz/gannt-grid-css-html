import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'gantt-gridd-exemplo';
  public dataInicioDate
  public dataFimDate
  public calendarGant
  public gantViewActive
  public nQtdColunasCalendario
  public one_day = 1000 * 60 * 60 * 24;
  public nqtdias = 360
  public testesomatotaldias = 0;
  ngOnInit()  {

    this.montacalendario(3, this.nqtdias)
  }

  montacalendario(opcs, nQtd) {
    this.testesomatotaldias = 0;
    this.gantViewActive = opcs;
    this.calendarGant = []
    this.dataInicioDate = new Date
    this.dataFimDate = new Date
    this.dataInicioDate = new Date(this.dataInicioDate.setDate(this.dataInicioDate.getDate() - nQtd));
    this.dataFimDate = new Date(this.dataFimDate.setDate(this.dataFimDate.getDate() ));

    let dataControl = new Date(this.dataInicioDate);

    if (opcs === 1) {
      this.nQtdColunasCalendario = calculateMonthBetween(this.dataInicioDate, this.dataFimDate) +2
    } else if (opcs === 2) {
      this.nQtdColunasCalendario = calculateWeeksBetween(this.dataInicioDate, this.dataFimDate)  +2
    } else if (opcs === 3) {
      this.nQtdColunasCalendario = Math.ceil((this.dataFimDate.getTime()-this.dataInicioDate.getTime())/this.one_day)
    }
    console.log(this.dataInicioDate)    
    console.log(this.dataFimDate)    
    console.log(this.nQtdColunasCalendario)
    for (let i = 0; i < nQtd; i++) {
      
      // Adiciona o ano

      let nPosAno = -1;
      for (let io = 0; io < this.calendarGant.length; io++) {
        if (this.calendarGant[io].ano === dataControl.getFullYear()) {
          nPosAno = io;
        }
      }

      //adiciona ano
      if (nPosAno < 0) {


        this.calendarGant.push(
          {
            ano: dataControl.getFullYear(),
            meses: [
              {
                mes: dataControl.getMonth(),
                mesNome: getNomedoMes(dataControl),
                semanas: [{
                  semana: getWeek(dataControl),
                  dias: [{
                    data: new Date(dataControl),
                    dia: dataControl.getDate(),
                    diaSemana: dataControl.getDay(),
                    diaSemanaDesc: getDiaDaSemana(dataControl)
                  }]

                }]
              }
            ]
          }
        )
      } else {

        // Verifica os meses
        let nPosMes = -1;
        for (let ix = 0; ix < this.calendarGant[nPosAno].meses.length; ix++) {
          if (this.calendarGant[nPosAno].meses[ix].mes === dataControl.getMonth()) {
            nPosMes = ix;
          }
        }

        if (nPosMes < 0) {


          this.calendarGant[nPosAno].meses.push(
            {
              mes: dataControl.getMonth(),
              mesNome: getNomedoMes(dataControl),
              semanas: [{
                semana: getWeek(dataControl),
                dias: [{
                  data: new Date(dataControl),
                  dia: dataControl.getDate(),
                  diaSemana: dataControl.getDay(),
                  diaSemanaDesc: getDiaDaSemana(dataControl)
                }]

              }]
            }

          )
        } else {
          // verifica se a semana já foi adicionada
          let nPosSemana = -1;
          for (let ib = 0; ib < this.calendarGant[nPosAno].meses[nPosMes].semanas.length; ib++) {
            if (this.calendarGant[nPosAno].meses[nPosMes].semanas[ib].semana === getWeek(dataControl)) {
              nPosSemana = ib;
            }
          }

          if (nPosSemana < 0) {

            this.calendarGant[nPosAno].meses[nPosMes].semanas.push(
              {
                semana: getWeek(dataControl),
                dias: [{
                  data: new Date(dataControl),
                  dia: dataControl.getDate(),
                  diaSemana: dataControl.getDay(),
                  diaSemanaDesc: getDiaDaSemana(dataControl)
                }]
              }
            );
          } else {
            // verifica os dias já foram adicionados
            let nPosDia = -1;
            for (let ib = 0; ib < this.calendarGant[nPosAno].meses[nPosMes].semanas[nPosSemana].dias.length; ib++) {
              if (this.calendarGant[nPosAno].meses[nPosMes].semanas[nPosSemana].dias[ib].dia === dataControl.getDate()) {
                nPosDia = ib;
              }
            }

            if (nPosDia < 0) {
              this.calendarGant[nPosAno].meses[nPosMes].semanas[nPosSemana].dias.push(
                {
                  data: new Date(dataControl),
                  dia: dataControl.getDate(),
                  diaSemana: dataControl.getDay(),
                  diaSemanaDesc: getDiaDaSemana(dataControl)
                });
            }
          }

        }




      }
      dataControl = new Date(dataControl.setDate(dataControl.getDate() + 1));

    }

    console.log(this.calendarGant)

  }

  
}


/**
 * Devolve o nome do mes
 * @param data 
 */
export function getNomedoMes(data) {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return months[data.getMonth()];
}

/**
* Devolve o dua da semana
* @param data 
*/
export function getDiaDaSemana(data) {
  const diaasemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  return diaasemana[data.getDay()];

}

export function getWeek(dataWeek) {
  // We have to compare against the first monday of the year not the 01/01
  // 60*60*24*1000 = 86400000
  // 'onejan_next_monday_time' reffers to the miliseconds of the next monday after 01/01

  const day_miliseconds = 86400000;
  const onejan = new Date(dataWeek.getFullYear(), 0, 1, 0, 0, 0);
  const onejan_day = (onejan.getDay() == 0) ? 7 : onejan.getDay();
  const days_for_next_monday = (8 - onejan_day);
  const onejan_next_monday_time = onejan.getTime() + (days_for_next_monday * day_miliseconds);
  // If one jan is not a monday, get the first monday of the year
  const first_monday_year_time = (onejan_day > 1) ? onejan_next_monday_time : onejan.getTime();
  const this_date = new Date(dataWeek.getFullYear(), dataWeek.getMonth(), dataWeek.getDate(), 0, 0, 0);// This at 00:00:00
  const this_time = this_date.getTime();
  const days_from_first_monday = Math.round(((this_time - first_monday_year_time) / day_miliseconds));;

  const first_monday_year = new Date(first_monday_year_time);

  // We add 1 to "days_from_first_monday" because if "days_from_first_monday" is *7,
  // then 7/7 = 1, and as we are 7 days from first monday,
  // we should be in week number 2 instead of week number 1 (7/7=1)
  // We consider week number as 52 when "days_from_first_monday" is lower than 0,
  // that means the actual week started before the first monday so that means we are on the firsts
  // days of the year (ex: we are on Friday 01/01, then "days_from_first_monday"=-3,
  // so friday 01/01 is part of week number 52 from past year)
  // "days_from_first_monday<=364" because (364+1)/7 == 52, if we are on day 365, then (365+1)/7 >= 52 (Math.ceil(366/7)=53) and thats wrong

  return (days_from_first_monday >= 0 && days_from_first_monday < 364) ? Math.ceil((days_from_first_monday + 1) / 7) : 52;
}


export function calculateMonthBetween(date1, date2) {
  const year1 = date1.getFullYear();
  const year2 = date2.getFullYear();
  let month1 = date1.getMonth();
  let month2 = date2.getMonth();
  if (month1 === 0) { //Have to take into account
    month1++;
    month2++;
  }
  const numberOfMonths = (year2 - year1) * 12 + (month2 - month1) - 1;

  return numberOfMonths;
}
/**
* Calcula quantas semandas possui uma faixa de datas
* @param date1 
* @param date2 
*/
export function calculateWeeksBetween(date1, date2) {
  // The number of milliseconds in one week
  const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
  // Convert both dates to milliseconds
  const date1_ms = date1.getTime();
  const date2_ms = date2.getTime();
  // Calculate the difference in milliseconds
  const difference_ms = Math.abs(date1_ms - date2_ms);
  // Convert back to weeks and return hole weeks
  return Math.floor(difference_ms / ONE_WEEK);
}