var d3 = require('d3');
var fs = require('fs');
var jsdom = require('jsdom');

module.exports = function BarChart(data, outputFilename) {
    if (!data) return;

    var outputFilename = outputFilename || 'chart.svg';

    jsdom.env({
        html: '',
        features: { QuerySelectorAll: true },
        done: function(errors, window) {
            window.d3 = d3.select(window.document);

            var barHeight = 20;
            var width = 420;

            var x = d3.scaleLinear()
                .domain([0, d3.max(data)])
                .range([0, width]);

            var chart = window.d3.select('body')
                .append('div')
                .attr('class', 'container')
                .append('svg')
                .attr('width', width)
                .attr('height', barHeight * data.length)
                .style('fill', '#333');

            var bar = chart.selectAll('g')
                .data(data)
                .enter().append('g')
                .attr('transform', (d, i) => `translate(0, ${ i * barHeight })`);

            bar.append('rect')
                .attr('width', x)
                .attr('height', barHeight - 1);

            bar.append('text')
                .style('fill', '#fff')
                .style('font', '10px sans-serif')
                .style('text-anchor', 'end')
                .attr('x', (d) => x(d) - 3)
                .attr('y', () => barHeight / 2)
                .attr('dy', '0.3em')
                .text((d) => d);

            fs.writeFileSync(outputFilename, window.d3.select('.container').html());
        }
    });
};
