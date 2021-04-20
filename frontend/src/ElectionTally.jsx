/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { withRouter } from 'react-router-dom'
import React from 'react'
import { AppUtil } from "./App";
import { findIndex } from "@amcharts/amcharts4/.internal/core/utils/Iterator";


export class ElectionTally extends React.Component{
    

    constructor(props){
        super()
        this.election = {name: "Unnamed", id: "none-existent-id"}

        if(props && props.location && props.location.state){
            this.election = props.location.state.election;
        }
            
    }

    componentDidMount(){

        AppUtil.startLoading()

        window.contract.election_tally.getTally(this.election.id).then((results)=>{
            let data = []

            window.contract.election_candidate.list(this.election.id).then((candidates)=>{

                let images = ["https://www.amcharts.com/wp-content/uploads/2019/04/joey.jpg", "https://www.amcharts.com/wp-content/uploads/2019/04/joey.jpg", "https://www.amcharts.com/wp-content/uploads/2019/04/ross.jpg", "https://www.amcharts.com/wp-content/uploads/2019/04/phoebe.jpg",
                "https://www.amcharts.com/wp-content/uploads/2019/04/rachel.jpg", "https://www.amcharts.com/wp-content/uploads/2019/04/monica.jpg" ] //place holder until candidates support images from the ui
                
                for(let c of candidates){

                    let idx = results[0].findIndex((x)=>x==c.key)

                    if(idx){
                        data.push({name: c.name,
                            steps: results[1][idx],
                            href: images[idx%images.length]
                        })
                    }
                }





            })

            this.renderChart(data)
            AppUtil.stopLoading()
            
        },()=>{AppUtil.stopLoading()})

      
    }


    render(){
        return(
            <div>
                <h1 className="text-2xl">{this.election.name} Tally Results</h1>
                <div style={{"min-height": '700px'}} id="chartdiv"></div>
            </div>
        
        )
    }


    renderChart(data){

  /* Chart code */
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * Chart design taken from Samsung health app
         */

        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.paddingRight = 40;

        chart.data = data

        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.renderer.tooltip.dx = -40;

        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        let series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "steps";
        series.dataFields.categoryY = "name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 30;
        series.columnsContainer.zIndex = 100;

        let columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
        series.mainContainer.mask = undefined;

        let cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        let bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "middle";
        bullet.align = "left";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        let hoverState = bullet.states.create("hover");
        let outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function (radius, target) {
            let circleBullet = target.parent;
            return circleBullet.circle.pixelRadius + 10;
        })

        let image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function (mask, target) {
            let circleBullet = target.parent;
            return circleBullet.circle;
        })

        let previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function (event) {
            let dataItem = series.tooltipDataItem;

            if (dataItem.column) {
                let bullet = dataItem.column.children.getIndex(1);

                if (previousBullet && previousBullet != bullet) {
                    previousBullet.isHover = false;
                }

                if (previousBullet != bullet) {

                    let hs = bullet.states.getKey("hover");
                    hs.properties.dx = dataItem.column.pixelWidth;
                    bullet.isHover = true;

                    previousBullet = bullet;
                }
            }
        })


    }
}

export default withRouter(ElectionTally);