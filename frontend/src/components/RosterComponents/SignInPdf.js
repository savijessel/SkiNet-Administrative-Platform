import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

export async function printSignInSheet(currentShift, list, session) {
  if (currentShift) {
    const COVID = true;

    var margin = 10;

    const doc = new jsPDF();

    doc.setFontSize(16);
    const header = "CSP Sign In " + currentShift.event.startStr;
    doc.text(header, 110, margin, "center");
    margin = margin + 8;

    doc.setFontSize(10);
    const generated = "Generated: " + new Date();
    doc.text(generated, 110, margin, "center");
    margin = margin + 6;

    if (COVID) {
      doc.text(
        "*I am NOT required to isolate as per current AHS COVID-19 Guidelines and am fit for patrol duties",
        110,
        margin,
        "center"
      );
      margin = margin + 6;
    }

    doc.text("Leader: __________", 110, margin, "center");
    margin = margin + 6;

    doc.text(
      "__ Regular Day   __ Special Event    __ Training Day",
      110,
      margin,
      "center"
    );
    margin = margin + 6;

    var areas = [];
    try {
      await session
        .get("areas", {}, {}, false)

        .then((response) => {
          for (let i = 0; i < response.data._embedded.areas.length; i++) {
            areas.push(response.data._embedded.areas[i].areaname);
          }
        })
        .catch((error) => {
          console.log("error " + error);
        });
    } catch (err) {
      console.log(err);
    }

    areas.push("");

    var seperatedList = new Array(areas.length);
    for (var i = 0; i < seperatedList.length; i++) {
      seperatedList[i] = new Array();
    }
    for (let i = 0; i < areas.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (list[j].area !== null) {
          if (
            list[j].area.areaname === areas[i] &&
            (list[j].role === "TRAINEE" ||
              list[j].role === "ROSTERED" ||
              list[j].role === "SHADOW")
          ) {
            seperatedList[i].unshift(list[j]);
          }
        }

        if (
          i === areas.length - 1 &&
          list[j].area === null 
          
          && (list[j].role === "TRAINEE" ||
            list[j].role === "ROSTERED" ||
            list[j].role === "SHADOW")
        ) {
          console.log("hi 2 " + list[j].name)
          seperatedList[areas.length - 1].unshift(list[j]);
        }
      }
    }

    for (let i = 0; i < areas.length; i++) {
      var head = [{}];
      if (seperatedList[i].length > 0 || i === areas.length - 1) {
        var body = new Array();
        const areaString = areas[i];
        head[0].key = "";
        head[0].area = areaString;
        head[0].lift = "Lift";
        head[0].lunch = "Lunch";
        head[0].rookie = "New?";
        head[0].pairedWith = "Paired with";
        if (COVID) {
          head[0].covid = "Covid*";
        } else {
          head[0].covid = "";
        }

        head[0].signin = "Sign In";
        head[0].comment = "Comment";
        for (
          let j = 0;
          j <
          (i !== areas.length - 1
            ? seperatedList[i].length > 0
              ? seperatedList[i].length
              : 0
            : seperatedList[i].length > 3
            ? seperatedList[i].length
            : 3);
          j++
        ) {
          body.push(new Object());
          body[j].key = j + 1;
          if (seperatedList[i][j]) {
            const userString =
              seperatedList[i][j].user !== null
                ? seperatedList[i][j].user.firstName +
                  " " +
                  seperatedList[i][j].user.lastName +
                  " : " +
                  seperatedList[i][j].user.phoneNumber
                : seperatedList[i][j].name +
                  " : " +
                  seperatedList[i][j].phoneNumber;
            body[j].area = userString;
            const commentString = seperatedList[i][j].comment + "";
            body[j].comment = commentString;
            body[j].rookie = seperatedList[i][j].user
              ? seperatedList[i][j].user.trainer === true
                ? ""
                : "Trainee"
              : "Shadow";
            body[j].pairedWith =
              seperatedList[i][j].shadowing !== null
                ? seperatedList[i][j].shadowing.firstName +
                  " " +
                  seperatedList[i][j].shadowing.lastName
                : "";
          } else {
            body[j].area = "            ";
            body[j].comment = "            ";
          }
        }
      }
      if (i > 0) {
        margin = doc.lastAutoTable.finalY;
      }
      let covid_column = 0;
      if (COVID) covid_column = 13;
      doc.autoTable({
        head: head,
        body: body,
        startY: margin,
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 5 },
          1: { cellWidth: 40 },
          2: { cellWidth: 9 },
          3: { cellWidth: 12 },
          4: { cellWidth: 15 },
          5: { cellWidth: 25 },
          6: { cellWidth: covid_column },
          7: { cellWidth: 45 },
          7: { cellWidth: 45 },
        },
        headStyles: {
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 8,
        },
      });
    }
    const pdf_name = "Sign-In-" + currentShift.event.startStr + ".pdf";
    doc.save(pdf_name);
  }
}
