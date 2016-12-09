// page init
jQuery(function () {
    initPopups();
    initMobileNav();
    initSVGResizeFix();
});

jQuery(window).on('load', function () {
    initInVieport();
    initDashboardChart();
    initTimelineChart();
});

function initSVGResizeFix() {
    var isIE = window.navigator.msPointerEnabled;
    if (!isIE) return;

    var win = jQuery(window),
		resizeTimer;

    win
		.on('load resize orientationchange', resizeHandler)
		.on('svgReady', refreshSVGSize);

    function resizeHandler() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refreshSVGSize, 50);
    }

    function refreshSVGSize() {
        var svgItem = jQuery('svg');
        svgItem.each(function () {
            var item = jQuery(this);
            var ratio = item.attr('width') / item.attr('height');
            item.css({
                height: item.width() / ratio
            });
        });
    }
}

// load more init
function initInVieport() {
    jQuery('.line-chart')
		.on('onChartReady', function () {
		    jQuery(this)
				.on('in-viewport', function (e, state) {
				    if (state) {
				        jQuery(this).trigger('startAnimation');
				    }
				})
				.itemInViewport({
				    activeClass: 'in-viewport',
				    once: true
				});
		});
}

// timeline chart init
function initTimelineChart() {
    var defaultOptions = {
        chartLabel: 'Release Stage Gate Timeline',
        width: 1260,
        height: 400,
        arcRadius: 20,
        extraSpace: 92,
        padding: 60,
        lineHeight: 23,
        pathRadius: 20,
        arcKoef: 1.7,
        radius: 21,
        animDuration: 1200
    };

    jQuery('.line-chart[data-json]').each(function () {
        var $holder = jQuery(this);
        var holder = d3.select(this);

        var options = jQuery.extend(true, {}, defaultOptions, holder.data('chartOptions'));

        var svg = holder.append('svg')
			.attr('width', options.width)
			.attr('height', options.height)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', '0 0 ' + options.width + ' ' + options.height);

        var fontFixDelay = 200;
        $holder.trigger('svgReady');

        // draw chart label
        var chartLabelGroup = drawChartLabel();

        d3.json($holder.data('json'), function (error, json) {
            if (error) return console.warn(error);

            var items = json.chartData.labels,
				itemsCount = items.length,
				mainChartGroup = svg
					.append('g')
					.attr('class', 'main-chart-group')
					.attr('transform', 'translate(' + options.padding + ',' + (chartLabelGroup[0][0].getBBox().height + 165) + ')'),
				defs = svg.append('defs'),
				chartGroup,
				clipPath,
				pointsGroup;


            options.lineLength = (options.width - (options.padding * 2 + options.extraSpace * 2 + itemsCount * options.radius * options.arcKoef)) / (itemsCount - 1);

            chartGroup = drawChart();
            drawLabels();
            pointsGroup = drawPoints();

            // draw bg gradient
            drawGradient({
                id: 'gradient',
                height: Math.ceil(chartGroup[0][0].getBBox().height),
                colors: json.chartData.bgColor
            });
            // draw active gradient
            drawGradient({
                id: 'gradient2',
                height: Math.ceil(chartGroup[0][0].getBBox().height),
                colors: json.chartData.activeColor
            });
            // draw top drop shadow
            drawShadow({
                id: 'dropshadow',
                stdDeviation: 0.8,
                dy: 1,
                dx: 1,
                color: 'rgba(0, 0, 0, 0.7)'
            });
            // draw clip path for active animation
            clipPath = createClipPath();

            // start animation
            $holder.on('startAnimation', startAnimation);
            $holder.trigger('onChartReady');

            function startAnimation() {
                var activeWidth = 0;
                var completedInfo = {
                    index: 0,
                    value: 0
                };

                // get active index
                items.forEach(function (el, ind) {
                    if (el.completed) {
                        completedInfo.index = ind;
                        completedInfo.value = Math.min(Math.max(0, parseFloat(el.completed)), 100);
                        return false;
                    }
                });
                if (completedInfo.index || completedInfo.value) {
                    if (completedInfo.index === 0) {
                        activeWidth = options.extraSpace * completedInfo.value / 100;
                        if (completedInfo.value === 100) {
                            activeWidth += options.radius * options.arcKoef;
                        }
                    } else {
                        activeWidth = options.lineLength * (completedInfo.index - 1) + options.extraSpace + completedInfo.index * options.radius * options.arcKoef + options.lineLength * completedInfo.value / 100;
                        if (completedInfo.value === 100) {
                            activeWidth += options.radius * options.arcKoef;
                            if (completedInfo.index === (items.length - 1)) {
                                activeWidth += options.extraSpace;
                            }
                        }
                    }
                }

                animateActivePath(activeWidth, function () {
                    startPulseAnimation(completedInfo);
                });
            }

            function animateActivePath(value, callback) {
                clipPath
					.transition()
					.ease('linear')
					.delay(0)
					.duration(options.animDuration)
					.attr('width', value)
					.each('end', callback);
            }

            function startPulseAnimation(completedInfo) {
                if (completedInfo.value === 100 && completedInfo.index === (items.length - 1)) return;
                var animEl = d3.select(pointsGroup.selectAll('.point')[0][completedInfo.index])
					.classed('anim-active', true)
					.select('g');

                var animDirection = 0;
                var defaultScale = 1;
                var defaultOpacity = animEl.select('circle').attr('opacity') || 0.5;

                animate();

                function animate() {
                    var animScale,
						endOpacity;

                    if (animDirection) {
                        animScale = defaultScale;
                        endOpacity = defaultOpacity;
                    } else {
                        animScale = 1.2;
                        endOpacity = 0.8;
                    }
                    animEl
						.transition()
							.ease('linear')
							.delay(0)
							.duration(500)
							.attr('transform', 'scale(' + animScale + ')')
							.attr('opacity', 'scale(' + endOpacity + ')')
							.each('end', function () {
							    animDirection = !animDirection;
							    animate();
							});
                }
            }

            function createClipPath() {
                var clipPath = defs
					.append('clipPath')
					.attr('id', 'clipPath');

                return clipPath
					.append('rect')
					.attr('x', 0)
					.attr('y', -10)
					.attr('width', 0)
					.attr('height', chartGroup[0][0].getBBox().height);
            }

            function drawChart() {
                var chartGroup = mainChartGroup
					.append('g')
					.attr('class', 'chart-group');
                var bottomPart,
					topPart,
					bottomOutline = '';
                var pathPoints = getPoints();

                // background path
                chartGroup
					.append('path')
					.attr('class', 'bg-chart')
					.attr('style', 'filter:url(#dropshadow)')
					.attr('stroke-linejoin', 'round')
					.attr('fill', 'url(#gradient)')
					.attr('d', pathPoints);

                // active path
                chartGroup
					.append('path')
					.attr('class', 'active-chart')
					.attr('style', 'clip-path: url(#clipPath); filter:url(#dropshadow);')
					.attr('stroke-linejoin', 'round')
					.attr('fill', 'url(#gradient2)')
					.attr('d', pathPoints);

                // draw bottom white outline
                chartGroup
					.append('path')
					.attr('class', 'chart-outline')
					.attr('stroke-linejoin', 'round')
					.attr('stroke-width', 0.5)
					.attr('opacity', 0.6)
					.attr('stroke', '#fff')
					.attr('fill', 'none')
					.attr('d', bottomOutline)
					.attr('transform', 'translate(' + 0 + ',' + 2.5 + ')');

                function getPoints() {
                    bottomPart = drawBottomPart();
                    topPart = drawTopPart();
                    return bottomPart + ' ' + topPart + 'z';
                }

                function drawTopPart() {
                    var resultStr = '';

                    var middleRight = [
						'l', 0, -options.lineHeight / 2
                    ];
                    resultStr = middleRight.join(' ');
                    var leftSpace = [
						'l', -options.extraSpace, 0
                    ];
                    resultStr += leftSpace.join(' ');

                    for (var i = 0; i < itemsCount; i++) {
                        (function (i) {
                            var circle = drawCircle();
                            var line;

                            resultStr += ' ' + circle.join(' ');

                            if (i === itemsCount - 1) {
                                line = [
									'l',
									-options.extraSpace, 0
                                ];
                                resultStr += ' ' + line.join(' ');
                                line = [
									'l',
									0, options.lineHeight / 2
                                ];
                                resultStr += ' ' + line.join(' ');
                            } else {
                                line = [
									'l',
									-options.lineLength, 0
                                ];
                                resultStr += ' ' + line.join(' ');
                            }
                        })(i);
                    }
                    return resultStr;
                }

                function drawBottomPart() {
                    var resultStr = '';
                    bottomOutline = '';

                    var middleLeft = [
						'M', 0, options.lineHeight * 0,
						'L', 0, options.lineHeight
                    ];
                    resultStr = middleLeft.join(' ');

                    bottomOutline = ([
						'M', 0, options.lineHeight,
						'L', options.extraSpace, options.lineHeight
                    ]).join(' ');

                    var leftSpace = [
						'l', options.extraSpace, 0
                    ];

                    resultStr += leftSpace.join(' ');

                    for (var i = 0; i < itemsCount; i++) {
                        (function (i) {
                            var circle = drawCircle(true);
                            var line;

                            resultStr += ' ' + circle.join(' ');
                            bottomOutline += ' ' + circle.join(' ');

                            if (i === itemsCount - 1) {
                                line = [
									'l',
									options.extraSpace, 0
                                ];
                                bottomOutline += ' ' + line.join(' ');
                                resultStr += ' ' + line.join(' ');
                                line = [
									'l',
									0, -options.lineHeight / 2
                                ];
                                resultStr += ' ' + line.join(' ');
                            } else {
                                line = [
									'l',
									options.lineLength, 0
                                ];
                                resultStr += ' ' + line.join(' ');
                                bottomOutline += ' ' + line.join(' ');
                            }
                        })(i);
                    }
                    return resultStr;
                }

                return chartGroup;
            }

            function drawLabels() {
                var labelsGroup = mainChartGroup
					.append('g')
					.attr('class', 'labels-group')
					.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

                var labels = labelsGroup.selectAll('.label')
					.data(items)
					.enter()
						.append('g')
						.attr('class', 'label')
						.attr('opacity', '0')
						.each(function (d, ind) {
						    var label = d3.select(this);

						    d.direction = ind % 2;
						    drawLabel(label, d);
						})
						.attr('transform', setLabelPosition);

                // wrong font fix
                setTimeout(function () {
                    labels
						.attr('transform', setLabelPosition)
						.attr('opacity', 1);
                }, fontFixDelay);


                function drawLabel(label, d) {
                    var bg = label
						.append('polygon')
						.attr('opacity', 0.5)
						.attr('stroke', '#ccc')
						.attr('stroke-width', 1)
						.attr('fill', '#000');

                    var text = label
						.append('text')
						.attr('class', 'label-text')
						.attr('fill', '#fff')
						.text(d.text);

                    // wrong font fix
                    setTimeout(function () {
                        bg.attr('points', function (d) {
                            return getPoints(text, d);
                        });
                    }, fontFixDelay);
                }

                function setLabelPosition(d, ind) {
                    var textBox = this.getBBox();
                    var y = 0;
                    var x = -17 + ind * (options.lineLength + options.radius * options.arcKoef) + options.extraSpace + options.radius * options.arcKoef / 2;
                    if (d.direction) {
                        y = options.radius * options.arcKoef + 14;
                    } else {
                        y = -textBox.height - (options.radius * options.arcKoef - options.lineHeight) / 2 - 20;
                    }
                    return 'translate(' + x + ',' + y + ')';
                }

                function getPoints(text, currentOptions) {
                    var opt = jQuery.extend({
                        extraSpaceX: 10,
                        extraSpaceY: 6
                    }, currentOptions);

                    var textBox = text[0][0].getBBox();
                    var points = [];
                    text.attr('transform', function () {
                        return 'translate(' + opt.extraSpaceX + ',' + textBox.height + ')';
                    });

                    points.push([0, opt.extraSpaceY + textBox.height]); // botttom left
                    if (opt.direction) {
                        points.push([textBox.width + 2 * opt.extraSpaceX, getLast(1)]); // bottom right
                        points.push([getLast(0), 5]); // top right
                        points.push([0 + 22, getLast(1)]); // arrow right
                        points.push([getLast(0) - 5, getLast(1) - 9]); // arrow top
                        points.push([getLast(0) - 5, getLast(1) + 9]); // arrow left
                        points.push([0, getLast(1)]); // top left
                    } else {
                        points.push([0 + 12, getLast(1)]); // arrow left
                        points.push([getLast(0) + 5, getLast(1) + 9]); // arrow bottom
                        points.push([getLast(0) + 5, getLast(1) - 9]); // arrow right
                        points.push([textBox.width + 2 * opt.extraSpaceX, getLast(1)]); // bottom right
                        points.push([getLast(0), 6]); // top right
                        points.push([0, getLast(1)]); // top left
                        points.push([0, opt.extraSpaceY + textBox.height]); // botttom left
                    }
                    points.push([0, opt.extraSpaceY + textBox.height]); // botttom left
                    function getLast(ind) {
                        return ind === undefined ? points[points.length - 1] : points[points.length - 1][ind];
                    }
                    return points;
                }

                return labelsGroup;
            }

            function drawPoints() {
                var pointsGroup = mainChartGroup
					.append('g')
					.attr('class', 'points-group')
					.attr('transform', 'translate(' + 0 + ',' + 0 + ')');

                var points = pointsGroup.selectAll('.point')
					.data(items)
					.enter()
						.append('g')
						.attr('class', 'point');
                points
					.append('g')
					.each(function (d, ind) {
					    var point = d3.select(this);
					    drawPoint(point, d, ind);
					});
                points.attr('transform', setPointPosition);


                function drawPoint(point, d, ind) {
                    var circle = point
						.append('circle')
						.attr('stroke', '#ccc')
						.attr('stroke-width', 0.6)
						.attr('r', 7.5)
						.attr('fill', '#000')
						.attr('opacity', 0.3);

                    return circle;
                }
                function setPointPosition(d, ind) {
                    var y = -7 + 1 + options.radius * options.arcKoef / 2;
                    var x = ind * (options.lineLength + options.radius * options.arcKoef) + options.extraSpace + options.radius * options.arcKoef / 2;
                    return 'translate(' + x + ',' + y + ')';
                }

                return pointsGroup;
            }
        });


        function drawCircle(reverse) {
            var d = ['a', options.radius, options.radius, 0, 0, 0, (reverse ? 1 : -1) * options.radius * options.arcKoef, 0];
            return d;
        }

        function drawShadow(obj) {
            var dropshadow = svg.select('defs')
				.append('filter')
				.attr('id', obj.id)
				.attr('height', '200%')
				.attr('width', '200%')
				.attr('y', '-50%')
				.attr('x', '-50%');
            var feMerge;

            dropshadow
				.append('feComponentTransfer')
				.attr('in', 'SourceAlpha')
					.append('feFuncA')
					.attr('tableValues', '1 0')
					.attr('type', 'table');

            dropshadow
				.append('feGaussianBlur')
				.attr('stdDeviation', obj.stdDeviation);

            dropshadow
				.append('feOffset')
				.attr('result', 'offsetblur')
				.attr('dy', obj.dy)
				.attr('dx', obj.dy);

            dropshadow
				.append('feFlood')
				.attr('result', 'color')
				.attr('flood-color', obj.color);

            dropshadow
				.append('feComposite')
				.attr('operator', 'in')
				.attr('in2', 'offsetblur');

            dropshadow
				.append('feComposite')
				.attr('operator', 'in')
				.attr('in2', 'SourceAlpha');

            feMerge = dropshadow.append('feMerge');
            feMerge
				.append('feMergeNode')
				.attr('in', 'SourceGraphic');
            feMerge
				.append('feMergeNode');

            return dropshadow;
        }

        function drawGradient(obj) {
            var gradient = svg.select('defs').append('linearGradient')
				.attr('id', obj.id)
				.attr('gradientUnits', 'userSpaceOnUse')
				.attr('x1', 0).attr('y1', 0)
				.attr('x2', 0).attr('y2', obj.height)
				.selectAll('stop')
				.data(obj.colors)
				.enter().append('stop')
				.attr('offset', function (d, ind) { return ind / (obj.colors.length - 1) * 100 + '%'; })
				.attr('stop-color', function (d) { return d; });

            return gradient;
        }

        function drawChartLabel() {
            var chartLabelGroup = svg
				.append('g')
				.attr('class', 'chart-label-group')
				.attr('transform', 'translate(' + 10 + ',' + 0 + ')');

            var textGroup = chartLabelGroup
				.append('g')
				.attr('class', 'text-group');

            var text = textGroup
				.append('text')
				.attr('class', 'text')
				.attr('fill', '#fff')
				.text(options.chartLabel);

            // wrong font fix
            setTimeout(function () {
                text.attr('transform', function () {
                    return 'translate(' + 0 + ',' + this.getBBox().height + ')';
                });
                drawLine();
            }, fontFixDelay);

            function drawLine() {
                var lineGroup = chartLabelGroup
					.append('g')
					.attr('class', 'line-group');
                var textBox = textGroup[0][0].getBBox();
                var rightSpace = 24;
                var vSpace = 17;

                var lineEnd = [textBox.width + rightSpace + 30, textBox.height + vSpace + 34];
                var points = [0, textBox.height + vSpace, textBox.width + rightSpace, textBox.height + vSpace, lineEnd];

                lineGroup
					.append('polyline')
					.attr('fill', 'none')
					.attr('stroke', '#fff')
					.attr('stroke-width', 0.6)
					.attr('points', points);

                lineGroup
					.append('circle')
					.attr('r', 5)
					.attr('cx', lineEnd[0])
					.attr('cy', lineEnd[1])
					.attr('stroke', '#fff')
					.attr('stroke-width', 0.2)
					.attr('fill', '#2B4358');

                return lineGroup;
            }
            return chartLabelGroup;
        }
    });
}

// donut chart init
function initDashboardChart() {
   
    var defaultOptions = {
        chartLabel: { title: 'Program', text: 'Dashboard' },
        width: 1400,
        height: 1200,
        defaultAngle: 0,
        labelsRadius: 450,
        circleAnimSpeed: 400,
        hoverClass: 'hover',
        completedURL: '/Content/Dashboard/images/check.png',
        backgroundCircles: [
			{
			    outerRadius: 367,
			    width: 367,
			    attrs: { class: 'main-circle', fill: '#354D69', stroke: '#2E435A', 'stroke-width': 2 },
			    dropshadow: { stdDeviation: 1, dy: 0, dx: 0, opacity: 1 }
			},
			{
			    outerRadius: 356,
			    width: 22,
			    attrs: { class: 'center-circle', fill: '#415B7C' }
			},
			{
			    outerRadius: 334,
			    width: 1,
			    attrs: { class: 'center-circle', fill: '#2E435A' }
			},
			{
			    outerRadius: 264,
			    width: 70,
			    attrs: { class: 'center-circle', fill: '#415B7C' }
			},
			{
			    outerRadius: 194,
			    width: 1,
			    attrs: { class: 'center-circle', fill: '#2E435A' }
			},
			{
			    outerRadius: 119,
			    width: 34,
			    attrs: { class: 'center-circle', fill: '#415B7C', stroke: '#2E435A', 'stroke-width': 1 }
			},
			{
			    outerRadius: 42,
			    width: 42,
			    attrs: { class: 'center-circle', fill: '#415B7C' }
			}
        ],
        generalDataOptions: [
			{
			    innerRadius: 340,
			    outerRadius: 347
			},
			{
			    innerRadius: 101,
			    outerRadius: 107
			},
			{
			    innerRadius: 19,
			    outerRadius: 25
			}
        ],
        sectorsDataOptions: {
            hardware: {
                innerRadius: 285,
                outerRadius: 317,
                fakeBgColor: '#354D69'
            },
            firmware: {
                innerRadius: 218,
                outerRadius: 248,
                fakeBgColor: '#415B7C'
            },
            software: {
                innerRadius: 143,
                outerRadius: 170,
                fakeBgColor: '#354D69'
            },
            'product-genesis': {
                innerRadius: 54,
                outerRadius: 72,
                fakeBgColor: '#354D69'
            }
        },
        titles: [
			{
			    name: 'hardware',
			    text: 'HARDWARE',
			    position: [-245, -157],
			    orientation: 'right'
			},
			{
			    name: 'firmware',
			    text: 'FIRMWARE',
			    position: [208, -112],
			    orientation: 'right'
			},
			{
			    name: 'software',
			    text: 'SOFTWARE',
			    position: [118, 115],
			    orientation: 'right'
			},
			{
			    name: 'product-genesis',
			    text: 'PRODUCT GENESIS',
			    position: [-63, 7],
			    orientation: 'left'
			},
			{
			    name: 'market-pressure',
			    text: 'MARKET PRESSURE',
			    position: [0, -30],
			    orientation: 'right'
			}
        ]
    };
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    jQuery('.main-chart[data-json]').each(function () {
        var $holder = jQuery(this);
        var holder = d3.select(this);
       
        var options = jQuery.extend(true, {}, defaultOptions, holder.data('chartOptions'));
        var animArcsList = [];
        var svg = holder.append('svg')
			.attr('width', options.width)
			.attr('height', options.height)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('viewBox', '0 0 ' + options.width + ' ' + options.height);

        var fontFixDelay = 200;
        var defs = svg.append('defs');

        $holder.trigger('svgReady');

        drawBackground();

        d3.json($holder.data('json'), function (error, json) {
            if (error) return console.warn(error);

            var generalData = json.chartData.generalData;
            var sectorsData = json.chartData.sectorsData;
            var sectorsCount = sectorsData.length;
            var labelsData = json.chartData.labels;
            var pulseLabels = [];
            var sectionsLabelsGroup;

            // draw chart label
            var chartLabelGroup = svg
				.append('g')
				.attr('class', 'chart-labels-group')
				.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');

            // draw tooltopshadow
            drawShadow({
                id: 'tooltip-shadow',
                dx: 0,
                dy: 5,
                stdDeviation: 10,
                opacity: 0.4
            });

            // build Business Momentum, Agile Vorticity, Marker Pressure circles
            drawGeneralData();

            // build sectors data arcs
            drawSectionsData();
            drawLines();

            // draw sectors title
            var titlesGroup = svg
				.append('g')
				.attr('class', 'titles-group')
				.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');
            // draw labels
            var labelsGroup = svg
				.append('g')
				.attr('class', 'labels-group')
				.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');
            var customLabelsGroup = svg
				.append('g')
				.attr('class', 'custom-labels-group')
				.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');

            // draw texts
            setTimeout(function () {
                drawChartLabel(chartLabelGroup);
                drawTitles(titlesGroup);
                drawLabels(labelsGroup);
                drawCustomLabels(customLabelsGroup);
                if (sectionsLabelsGroup) {
                    jQuery(sectionsLabelsGroup[0][0]).prependTo(svg);
                }
            }, 500);

            jQuery(labelsGroup[0][0]).appendTo(svg);

            $holder.trigger('onChartReady');

            // animate chart
            animateChart(function () {
                $holder.addClass('js-sectors-shown');
                setTimeout(function () {
                    initLabelsPulseAnimation();
                    initPulseAnimation();
                }, 500);
            });

            function animateChart(callback) {
                var animIndex = 0;

                animArcsList.sort(function (a, b) {
                    var diff = a.data.outerRadius - b.data.outerRadius;
                    if (diff === 0) diff = (a.fakeNum - b.fakeNum) || 0;
                    return diff;
                });

                animateArc();

                function animateArc() {
                    var arcItem = d3.select(animArcsList[animIndex].el);
                    var data = animArcsList[animIndex].data;

                    arcItem
						.transition()
						.ease('linear')
						.delay(0)
						.duration(function () {
						    return (data.endAngle - data.startAngle) * options.circleAnimSpeed / (2 * Math.PI);
						})
						.attrTween('d', function () {
						    return function (t) {
						        return data.arc({
						            startAngle: data.startAngle,
						            endAngle: data.startAngle + (data.endAngle - data.startAngle) * t
						        });
						    };
						})
						.each('end', function () {
						    if (animIndex < animArcsList.length - 1) {
						        animIndex++;
						        animateArc();
						    } else if (jQuery.isFunction(callback)) {
						        callback();
						    }
						});
                }
            }

            function initPulseAnimation() {
                animArcsList.forEach(function (item, ind) {
                    if (!item.data.pulseArc) return;
                    var animItem = d3.select(item.el);

                    animItem.classed('animated-item', true);

                    var startArc = item.data.arc
						.startAngle(item.data.startAngle)
						.endAngle(item.data.endAngle);

                    inAnim();
                    function inAnim() {
                        animItem.transition()
							.ease('linear')
							.delay(0)
							.duration(300)
							.attr('d', item.data.pulseArc)
							.attr('opacity', 0.8)
							.each('end', outAnim);
                    }
                    function outAnim() {
                        animItem.transition()
							.ease('linear')
							.delay(0)
							.duration(300)
							.attr('d', startArc)
							.attr('opacity', 1)
							.each('end', inAnim);
                    }
                });
            }

            function initLabelsPulseAnimation() {
                var animDirection = 0;
                var count = pulseLabels.length;

                animate();

                function animate() {
                    var endCount = 0;
                    pulseLabels.forEach(function (el, ind) {
                        d3.select(el)
							.classed('anim-active', true)
							.transition()
								.ease('linear')
								.delay(0)
								.duration(300)
								.attr('transform', 'scale(' + (animDirection ? 1 : 1.05) + ')')
								.each('end', function () {
								    endCount++;
								    if (endCount === count) {
								        animDirection = !animDirection;
								        animate();
								    }
								});
                    });
                }
            }

            function drawChartLabel(chartLabelGroup) {
                var textGroup = chartLabelGroup
					.append('g')
					.attr('class', 'text-group');

                var title = textGroup
					.append('text')
					.attr('class', 'title')
					.attr('fill', '#fff')
					.text(options.chartLabel.title);

                var text = textGroup
					.append('text')
					.attr('class', 'text')
					.attr('fill', '#fff')
					.text(options.chartLabel.text);

                setTimeout(function () {
                    positionItems([
						{
						    el: title,
						    space: 10
						},
						{
						    el: text,
						    space: 10
						}
                    ]);

                    drawLine();
                }, fontFixDelay);



                function drawLine() {
                    var lineGroup = chartLabelGroup
						.append('g')
						.attr('class', 'line-group');

                    var points = [0, 0, -28, -34, -42 - textGroup[0][0].getBBox().width, -34];

                    lineGroup
						.append('polyline')
						.attr('fill', 'none')
						.attr('stroke', '#fff')
						.attr('stroke-width', 0.5)
						.attr('points', points);

                    lineGroup
						.append('circle')
						.attr('r', 5)
						.attr('stroke', '#fff')
						.attr('stroke-width', 0.2)
						.attr('fill', '#2B4358');

                    lineGroup.attr('transform', 'translate(' + -156 + ',' + (-options.labelsRadius) + ')');
                    textGroup
						.attr('transform', 'translate(' + (-156 + points[points.length - 2]) + ',' + (-options.labelsRadius - 53) + ')');

                    return lineGroup;
                }
            }

            function drawGeneralData() {
                var generalGroup = svg
					.append('g')
					.attr('class', 'general-group')
					.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');

                generalData.forEach(function (el, i) {
                    jQuery.extend(true, el, options.generalDataOptions[i]);
                    el.arc = d3.svg.arc()
						.innerRadius(options.generalDataOptions[i].innerRadius)
						.outerRadius(options.generalDataOptions[i].outerRadius);
                    if (el.pulse) {
                        el.pulseArc = d3.svg.arc()
							.innerRadius(options.generalDataOptions[i].innerRadius)
							.outerRadius(options.generalDataOptions[i].outerRadius + 2);
                    }
                });

                var generalArcItems = generalGroup.selectAll('.general-arc')
					.data(generalData)
					.enter()
						.append('g')
						.attr('class', 'general-arc')
							.append('path')
							.attr('fill', function (d) {
							    return d.color;
							})
							.filter(function (d) {
							    return d.href;
							})
							.classed('clickable-item', true)
							.on('click', function (d) {
							    window.location = d.href;
							}).each(function (d, ind) {
							    d.startAngle = 0;
							    d.endAngle = 2 * Math.PI;

							    animArcsList.push({
							        el: this,
							        data: d
							    });
							});
            }

            function drawSectionsData() {
                var sectorsGroup = svg
					.append('g')
					.attr('class', 'sectors-group')
					.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');

                sectorsData.forEach(function (el, i) {
                    el.data.forEach(function (elData, ind) {
                        jQuery.extend(true, elData, options.sectorsDataOptions[elData.name]);
                        elData.startAngle = i * (Math.PI * 2) / sectorsCount + 0.01;
                        elData.endAngle = (i + 1) * (Math.PI * 2) / sectorsCount - 0.01;
                        elData.arc = d3.svg.arc()
							.innerRadius(elData.innerRadius)
							.outerRadius(elData.outerRadius);

                        if (elData.pulse) {
                            elData.pulseArc = d3.svg.arc()
								.innerRadius(elData.innerRadius)
								.outerRadius(elData.outerRadius + 2)
								.startAngle(elData.startAngle - 0.01)
								.endAngle(elData.endAngle + 0.01);
                        }
                    });
                });

                sectorsGroup.selectAll('.sector-arcs')
					.data(sectorsData)
					.enter()
						.append('g')
						.attr('class', 'sector-arcs')
						.each(function (d, ind) {
						    var arcs = d3.select(this)
								.selectAll('.arc')
								.data(d.data)
								.enter()
									.append('path')
									.attr('class', 'arc')
									.attr('fill', function (d) {
									    return d.color;
									})
									.each(function (data, i) {
									    animArcsList.push({
									        el: this,
									        data: data,
									        fakeNum: 10 * ind + i
									    });
									});

						    // add click handler
						    arcs
								.filter(function (d) {
								    return d.href;
								})
								.classed('clickable-item', true)
								.on('click', function (d) {
								    window.location = d.href;
								});
						});
            }

            function drawLines() {
                var sectorAngle = Math.PI * 2 / sectorsCount;
                var sectorsGroup = svg
					.append('g')
					.attr('class', 'lines-group')
					.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');

                for (var i = 0; i < sectorsCount; i++) {
                    drawSectorLines(i);
                }

                function drawSectorLines(sectorInd) {
                    var angle = sectorAngle * sectorInd;
                    var sectorGroup = sectorsGroup
						.append('g')
						.attr('class', 'sector-lines-group');

                    for (var key in options.sectorsDataOptions) {
                        drawLine(key);
                    }

                    function drawLine(key) {
                        var data = options.sectorsDataOptions[key];
                        var startPoint = d3.svg.arc()
							.innerRadius(data.innerRadius - 5)
							.outerRadius(data.innerRadius - 5)
							.centroid({
							    startAngle: angle,
							    endAngle: angle
							});
                        var endPoint = d3.svg.arc()
							.innerRadius(data.outerRadius + 5)
							.outerRadius(data.outerRadius + 5)
							.centroid({
							    startAngle: angle,
							    endAngle: angle
							});

                        var line = sectorGroup
							.append('line')
							.attr('x1', startPoint[0])
							.attr('y1', startPoint[1])
							.attr('x2', endPoint[0])
							.attr('y2', endPoint[1])
							.attr('stroke', data.fakeBgColor)
							.attr('stroke-width', 18);
                    }
                }
            }

            function drawLabels(labelsGroup) {
                var labelArc = d3.svg.arc()
					.innerRadius(options.labelsRadius)
					.outerRadius(options.labelsRadius);

                var labels;

                // prepare labels per sectors
                var labelsArray = getLabelsArray();

                labelsArray.forEach(function (el, ind) {
                    var sectorNameIndex = 1;
                    if (ind === 1) {
                        sectorNameIndex = Math.floor(el.length / 2);
                    } else if (ind === 2) {
                        sectorNameIndex = el.length - 1;
                    }
                    if (!el.length) sectorNameIndex = 0;

                    el.splice(sectorNameIndex, 0, {
                        sectorLabel: sectorsData[ind].label
                    });
                });

                labelsGroup
					.selectAll('.sector-labels')
					.data(labelsArray)
					.enter()
						.append('g')
						.attr('class', 'sector-labels')
						.each(function (labelsArray, sectorInd) {
						    var sectorLabel = d3.select(this);
						    // get sector start and end angles
						    var sectorEndAngle = sectorsData[sectorInd].data[0].endAngle;
						    var sectorStartAngle = sectorsData[sectorInd].data[0].startAngle;
						    // get angle step for labels
						    var labelAngleStep;
						    if (sectorInd === sectorsCount - 1 || sectorInd === 0) {
						        labelAngleStep = (sectorEndAngle - sectorStartAngle) / (labelsArray.length + 2);
						    } else {
						        labelAngleStep = (sectorEndAngle - sectorStartAngle) / (labelsArray.length + 1);
						    }

						    sectorLabel
								.selectAll('.label')
								.data(labelsArray)
								.enter()
									.append('g')
									.attr('class', 'label')
									.each(function (data, labelInd) {
									    data.orientation = 'left';
									    var labelAngle;
									    if (sectorInd === 0) {
									        labelAngle = (labelInd + 2) * labelAngleStep + sectorStartAngle;
									    } else {
									        labelAngle = (labelInd + 1) * labelAngleStep + sectorStartAngle;
									    }
									    if (Math.abs(labelAngle - Math.PI) < 0.0001) labelAngle = Math.PI;

									    if (labelAngle > Math.PI) {
									        data.orientation = 'right';
									    }

									    var coords = labelArc.centroid({
									        startAngle: labelAngle,
									        endAngle: labelAngle
									    });

									    data.x = coords[0];
									    data.y = coords[1];
									    data.labelAngle = labelAngle;
									    this._labelAngle = labelAngle;
									    if (data.sectorLabel) {
									        createSectionLabel(data, d3.select(this));
									    } else {
									        createLabel(data, d3.select(this));
									    }
									});
						});

                attachLabelEvents();

                function attachLabelEvents() {
                    var hoverTimer,
						labels = labelsGroup.selectAll('.label'),
						$mainHolder = jQuery(labelsGroup[0][0]),
						lastActiveLabel;

                    function hideTooltip(el) {
                        var $label;
                        labels.classed(options.hoverClass, false);

                        if (!el) return;

                        $label = jQuery(el);
                        if (el._next) {
                            $label.insertBefore(el._next);
                        } else if (el._holder) {
                            $label.appendTo(el._holder);
                        }
                    }
                    function showTooltip(label) {
                        var $label = jQuery(label),
							next,
							holder;

                        if (!label._next && !label._holder) {
                            next = $label.next();
                            if (!next.length) {
                                holder = $label.parent();
                                label._holder = holder;
                            } else {
                                label._next = next;
                            }
                        }
                        clearTimeout(hoverTimer);
                        hideTooltip(lastActiveLabel);

                        $label.appendTo($mainHolder);
                        d3.select(label).classed(options.hoverClass, true);
                        lastActiveLabel = label;
                    }

                    if (isTouchDevice) {
                        jQuery(labelsGroup[0][0]).find('g.label')
							.on('click', function () {
							    var $label = jQuery(this);
							    if ($label.is(lastActiveLabel)) {
							        hideTooltip(this);
							        lastActiveLabel = null;
							    } else {
							        showTooltip(this);
							    }
							});
                    } else {
                        jQuery(labelsGroup[0][0]).find('g.label')
							.one('mouseenter', enterHandler);
                    }

                    function enterHandler() {
                        showTooltip(this);
                        jQuery(this).one('mouseleave', leaveHandler);
                    }
                    function leaveHandler() {
                        var el = this;
                        var $label = jQuery(this);
                        clearTimeout(hoverTimer);
                        hoverTimer = setTimeout(function () {
                            hideTooltip(el);
                            lastActiveLabel = null;
                        }, 500);
                        $label.one('mouseenter', enterHandler);
                    }
                }

                function getLabelsArray() {
                    var labelsArray = [];
                    var addedCount = 0;
                    var tmpLabelsArray = jQuery.extend(true, [], labelsData);
                    var tmpLabelsCount = tmpLabelsArray.length;
                    var tmpArray, labelsCount = 0;

                    for (var i = sectorsCount; i > 0; i--) {
                        tmpArray = [];
                        labelsCount = Math.floor(tmpLabelsCount / i);

                        tmpArray = tmpLabelsArray.splice(0, labelsCount);
                        tmpLabelsCount -= labelsCount;
                        addedCount += labelsCount;
                        labelsArray.push(tmpArray);
                    }
                    return labelsArray;
                }

                return labelsGroup;
            }

            function createSectionLabel(data, label) {
                var extraSpace = 10;
                var textGroup;
                var bg;
                var text;
                var labelX, labelY;

                if (!sectionsLabelsGroup) {
                    sectionsLabelsGroup = svg
						.append('g')
						.attr('class', 'section-labels-group')
						.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');
                }

                label.classed('sector-label', true);

                jQuery(label[0][0]).appendTo(sectionsLabelsGroup[0][0]);

                textGroup = label.append('g').attr('class', 'text-group');

                bg = textGroup
					.append('polygon')
					.attr('class', 'bg')
					.attr('stroke', '#E2E4EE')
					.attr('stroke-width', 1)
					.attr('fill', '#000')
					.attr('opacity', 0.4);

                text = textGroup
					.append('text')
					.attr('fill', '#fff')
					.text(data.sectorLabel);

                setTimeout(function () {
                    bg.attr('points', function () {
                        return getPoints(text);
                    });
                    // set label position
                    label.attr('transform', function () {
                        labelX = data.x || 0;
                        labelY = data.y || 0;
                        if (data.labelAngle === Math.PI) {
                            labelX -= this.getBBox().width / 2;
                            labelY += 13;
                        } else {
                            var coords = d3.svg.arc()
								.innerRadius(options.labelsRadius + 20)
								.outerRadius(options.labelsRadius + 20)
								.centroid({
								    startAngle: data.labelAngle,
								    endAngle: data.labelAngle
								});
                            labelX = coords[0];
                            labelY = coords[1];
                            if (data.orientation === 'right') {
                                labelX -= this.getBBox().width;
                            }
                        }
                        return 'translate(' + labelX + ',' + labelY + ')';
                    });
                    drawLine();
                }, fontFixDelay);


                function drawLine() {
                    var linePoints = [0, 0];
                    var linePos = [0, 0];
                    var pointSpace = 13;
                    var pointArc;

                    var lineGroup = label
						.append('g')
						.attr('class', 'line-group');

                    var line = lineGroup
						.append('polyline')
						.attr('fill', 'none')
						.attr('stroke', '#fff')
						.attr('stroke-width', 0.5);

                    var linePoint = lineGroup
						.append('circle')
						.attr('cx', 0)
						.attr('cy', 0)
						.attr('r', 5)
						.attr('stroke', '#E2E4EE')
						.attr('stroke-width', 0.2)
						.attr('fill', '#2D475F');

                    var labelBox = label[0][0].getBBox();

                    if (data.labelAngle === Math.PI) {
                        linePos = [labelBox.width / 2 - 7, -pointSpace];

                        linePoints.push(linePoints[0]);
                        linePoints.push(linePoints[1] - (options.labelsRadius - options.backgroundCircles[0].outerRadius));
                    } else {
                        linePos[1] = labelBox.height / 2 - 2;
                        if (data.labelAngle > Math.PI) {
                            linePos[0] = labelBox.width - 2 + pointSpace;
                            linePoints.push(50);
                        } else {
                            linePos[0] = -pointSpace;
                            linePoints.push(-50);
                        }
                        linePoints.push(0);

                        pointArc = d3.svg.arc()
							.innerRadius(options.backgroundCircles[0].outerRadius)
							.outerRadius(options.backgroundCircles[0].outerRadius)
							.centroid({
							    endAngle: data.labelAngle,
							    startAngle: data.labelAngle
							});

                        pointArc[0] = -pointArc[0];
                        pointArc[1] = -pointArc[1];
                        linePoints.push(pointArc);
                    }

                    lineGroup.attr('transform', function () {
                        return 'translate(' + linePos[0] + ',' + linePos[1] + ')';
                    });

                    line.attr('points', linePoints.join(','));

                    return lineGroup;
                }

                function getPoints(text) {
                    var textBox = text[0][0].getBBox();
                    var points = [];
                    var spaceX = 20;
                    var spaceY = 10;
                    var lineHeight = 47;

                    text.attr('transform', function () {
                        return 'translate(' + spaceX + ',' + (lineHeight - 10) + ')';
                    });

                    points.push([0, lineHeight]); // botttom left
                    points.push([getLast(0), 0]); // top left
                    points.push([textBox.width + 2 * spaceX, getLast(1)]); // top right
                    points.push([getLast(0), lineHeight]); // bottom right
                    points.push([0, getLast(1)]); // botttom left

                    function getLast(ind) {
                        return ind === undefined ? points[points.length - 1] : points[points.length - 1][ind];
                    }
                    return points;
                }

                return label;
            }

            function createLabel(data, label) {
                var radius = 22;
                var circlesGroup;
                var labelBg;
                var textGroup;
                var title, text;
                var arrow;
                var labelTooltip;
                var pulseHolder;

                label.classed(data.extraClass, data.extraClass);

                circlesGroup = label
					.append('g')
					.attr('class', 'label-circles');

                pulseHolder = circlesGroup
					.append('g')
					.attr('class', 'pulse-holder')
					.each(function (d) {
					    if (d.pulse) pulseLabels.push(this);
					});

                labelBg = pulseHolder
					.append('circle')
					.attr('class', 'label-bg')
					.attr('cx', 0)
					.attr('cy', 0)
					.attr('r', radius)
					.attr('fill', '#3F5A75')
					.attr('stroke', '#fff')
					.attr('stroke-width', 0.3);

                drawLabelCenter();

                textGroup = label
					.append('g')
					.attr('class', 'label-text-group');

                if (data.text) {
                    text = textGroup
						.append('text')
						.attr('class', 'label-text')
						.attr('fill', '#fff')
						.text(data.text);
                }
                if (data.title) {
                    title = textGroup
						.append('text')
						.attr('class', 'label-title')
						.attr('fill', '#fff')
						.text(data.title);
                }

                arrow = createTriangle();

                setTimeout(function () {
                    layoutLabel();

                    label.attr('transform', function () {
                        var x = data.x || 0;
                        var y = data.y || 0;
                        if (data.orientation === 'right') {
                            x -= this.getBBox().width;
                            if (arrow) x += 20;
                        }
                        return 'translate(' + x + ',' + y + ')';
                    });

                    labelTooltip = drawLabelTooltip();
                    jQuery(circlesGroup[0][0]).append(jQuery(labelTooltip[0][0]));
                }, fontFixDelay);

                function drawLabelCenter() {
                    var center = pulseHolder
						.append('g')
						.attr('class', 'label-center');

                    var arc = d3.svg.arc();

                    if (data.completed) {
                        center
							.append('circle')
							.attr('cx', 0)
							.attr('cy', 0)
							.attr('r', radius - 5)
							.attr('fill', '#2FF642');

                        jQuery('<img/>')
							.on('load', function () {
							    center
									.append('svg:image')
									.attr('x', -this.width / 2)
									.attr('y', -this.height / 2)
									.attr('width', this.width)
									.attr('height', this.height)
									.attr('xlink:href', options.completedURL);
							})
							.attr('src', options.completedURL);

                    } else {
                        arc = d3.svg.arc()
							.innerRadius(0)
							.outerRadius(radius - 5);
                        if (data.topColor) {
                            center
								.append('path')
								.attr('fill', data.topColor)
								.attr('d', function () {
								    return arc({
								        endAngle: Math.PI / 2,
								        startAngle: -Math.PI / 2
								    });
								});
                        }
                        if (data.bottomColor) {
                            center
								.append('path')
								.attr('fill', data.bottomColor)
								.attr('d', function () {
								    return arc({
								        endAngle: 1.5 * Math.PI,
								        startAngle: 0.5 * Math.PI
								    });
								});
                        }

                        center
							.append('line')
							.attr('x1', -(radius - 3))
							.attr('y1', 0)
							.attr('x2', (radius - 3))
							.attr('y2', 0)
							.attr('fill', 'none')
							.attr('stroke', '#3F5A75')
							.attr('stroke-width', 2);

                    }
                    return center;
                }
                function createTriangle() {
                    var arrow,
						arrowPolyline;

                    if (data.state) {
                        arrow = label
							.append('g')
							.attr('class', 'label-arrow');

                        arrowPolyline = arrow
							.append('polygon')
							.attr('fill', '#fff');

                        if (data.state === 'up') {
                            arrowPolyline.attr('points', [0, 0, 4.5, -7, 9, 0, 0, 0]);
                        } else {
                            arrowPolyline.attr('points', [0, 0, 4.5, 7, 9, 0, 0, 0]);
                        }
                    }
                    return arrow;
                }
                function drawLabelTooltip() {
                    var tooltip = label
						.append('g')
						.attr('class', 'label-tooltip');

                    var tooltipBgHolder = tooltip
						.append('g')
						.attr('class', 'tooltip-bg')
						.attr('style', 'filter:url(#tooltip-shadow)');

                    var tooltipBg = tooltipBgHolder
						.append('polygon')
						.attr('opacity', 0.6)
						.attr('stroke', '#ccc')
						.attr('stroke-width', 0.4)
						.attr('fill', '#000');

                    var tooltipContent = tooltip
						.append('g')
						.attr('class', 'tooltip-content');

                    var tooltipRows = tooltipContent
						.selectAll('.label-tooltip-row')
						.data(data.tooltip)
						.enter()
							.append('g')
							.attr('class', 'label-tooltip-row')
							.each(function (d, ind) {
							    var row = d3.select(this);
							    var textElements = [];
							    var title, text;

							    if (d.title) {
							        title = row
										.append('text')
										.attr('class', 'label-tooltip-title')
										.attr('fill', '#fff')
										.text(d.title + ':');
							        textElements.push({
							            space: 5,
							            el: title
							        });
							    }
							    if (d.text) {
							        text = row
										.append('text')
										.attr('class', 'label-tooltip-text')
										.attr('fill', '#fff')
										.text(d.text);
							        textElements.push({
							            space: 0,
							            el: text
							        });
							    }
							    setTimeout(function () {
							        positionItems(textElements);
							    }, fontFixDelay);
							});

                    tooltip
						.filter(function (d) {
						    return d.href;
						})
						.classed('clickable-item', true)
						.on('click', function (d) {
						    window.location = d.href;
						});

                    setTimeout(function () {
                        positionRows(tooltipRows[0], -1);
                        tooltipBg.attr('points', getBgPoints({
                            direction: data.orientation
                        }));
                        repositionTooltip();
                    }, fontFixDelay);

                    function repositionTooltip() {
                        var tooltipBox = tooltip[0][0].getBBox();
                        var x = 5;
                        if (data.orientation === 'left') {
                            x -= tooltipBox.width - radius - 13;
                        }

                        tooltip
							.attr('transform', 'translate(' + x + ',' + (-tooltipBox.height - radius / 2 - 12) + ')');
                    }

                    function positionRows(itemsArray, vspace) {
                        var currentTop = 0;
                        if (!vspace) vspace = 10;

                        itemsArray.forEach(function (item) {
                            var el = d3.select(item);
                            var textBox = item.getBBox();
                            el.attr('transform', 'translate(' + 0 + ',' + (currentTop + textBox.height) + ')');
                            currentTop += textBox.height + vspace;
                        });
                    }

                    function getBgPoints(currentOptions) {
                        var opt = jQuery.extend(true, {
                            extraSpaceX: 23,
                            extraSpaceY: 7,
                            direction: 'right'
                        }, currentOptions);

                        var textBox = tooltipContent[0][0].getBBox();
                        var points = [];
                        tooltipBgHolder.attr('transform', 'translate(' + 0.5 + ',' + 0 + ')');
                        points.push([-opt.extraSpaceX, textBox.height + opt.extraSpaceY + 14]); // botttom left
                        points.push([getLast(0), -opt.extraSpaceY]); // top left
                        points.push([textBox.width + opt.extraSpaceX, getLast(1)]); // top right
                        points.push([getLast(0), textBox.height + opt.extraSpaceY + 14]); // bottom right

                        if (opt.direction === 'right') {
                            points.push([0, getLast(1)]); // arrow right
                            points.push([getLast(0) - 5, getLast(1) + 10]); // arrow bottom
                            points.push([getLast(0) - 5, getLast(1) - 10]); // arrow left
                        } else {
                            points.push([getLast(0) - 13, getLast(1)]); // arrow right
                            points.push([getLast(0) - 5, getLast(1) + 10]); // arrow bottom
                            points.push([getLast(0) - 5, getLast(1) - 10]); // arrow left
                        }
                        points.push([-opt.extraSpaceX, getLast(1)]);

                        function getLast(ind) {
                            return ind === undefined ? points[points.length - 1] : points[points.length - 1][ind];
                        }
                        return points;
                    }

                    return tooltip;
                }
                function layoutLabel() {
                    var layoutItems = [];
                    var textItems = [];

                    if (arrow) {
                        layoutItems.push({
                            space: 5,
                            el: arrow,
                            y: data.state === 'down' ? -4 : 3,
                            name: 'arrow',
                            extraX: data.orientation === 'right' ? 0 : -10,
                            extraSpace: -10
                        });
                    }
                    layoutItems.push({
                        space: data.orientation === 'right' ? 5 : 10,
                        el: circlesGroup,
                        name: 'bg',
                        extraX: circlesGroup[0][0].getBBox().width / 2
                    });
                    if (textGroup) {
                        layoutItems.push({
                            space: 8,
                            y: 5,
                            el: textGroup,
                            name: 'textGroup'
                        });
                    }
                    if (text) {
                        textItems.push({
                            space: 5,
                            el: text,
                            name: 'text'
                        });
                    }
                    if (title) {
                        textItems.push({
                            space: 5,
                            el: title,
                            name: 'title'
                        });
                    }

                    label.classed('label-orientation-' + data.orientation, true);

                    if (data.orientation === 'right') {
                        layoutItems.reverse();
                    }

                    // set label items position
                    if (textItems.length) {
                        positionItems(textItems);
                    }
                    positionItems(layoutItems);
                }
                return label;
            }

            function drawCustomLabels(customLabelsGroup) {
                var customLabelsData = [
					{
					    name: 'label1',
					    data: [
							{
							    text: 'Business',
							    'class': 'title'
							},
							{
							    text: 'Momentum',
							    'class': 'text'
							}
					    ]
					},
					{
					    name: 'label2',
					    data: [
							{
							    text: 'Agile',
							    'class': 'text'
							},
							{
							    text: 'Vorticity',
							    'class': 'title'
							}
					    ]
					}
                ];

                // draw label Business Momentum
                var customLabels = customLabelsGroup
					.selectAll('.custom-label')
					.data(customLabelsData)
					.enter()
						.append('g')
						.attr('class', 'custom-label')
						.each(function (d, ind) {
						    var d3Label = d3.select(this);
						    var textGroup = createTextGroup(d3Label, d.data);

						    // wrong font fix
						    setTimeout(function () {
						        var linePoints = getLinePoints(d);
						        var lineGroup = drawLine(d3Label, d, linePoints);
						        repositionTextGroup(d, textGroup, linePoints);
						    }, fontFixDelay);
						});

                function repositionTextGroup(d, textGroup, linePoints) {
                    var textBox = textGroup[0][0].getBBox();
                    var x, y;
                    if (d.name === 'label1') {
                        x = linePoints[linePoints.length - 2] - textBox.width / 2;
                        y = linePoints[linePoints.length - 1] - textBox.height + 20;
                        textGroup
							.attr('transform', 'translate(' + x + ',' + y + ')');

                    } if (d.name === 'label2') {
                        textGroup
							.attr('transform', 'translate(' + linePoints[0][0] + ',' + (linePoints[0][1] + 4) + ')');
                    }
                }

                function createTextGroup(label, textItemsData) {
                    var textGroup = label
						.append('g')
						.attr('class', 'text-group');
                    var textItems = [];

                    textGroup
						.selectAll('text')
						.data(textItemsData)
						.enter()
							.append('text')
							.attr('fill', '#fff')
							.each(function (d) {
							    var textItem = d3.select(this);
							    textItem
									.text(d.text)
									.attr('class', d['class']);

							    textItems.push({
							        space: 10,
							        el: textItem
							    });
							});
                    // wrong font fix
                    setTimeout(function () {
                        positionItems(textItems);
                    }, fontFixDelay);
                    return textGroup;
                }

                function drawLine(label, data, linePoints) {
                    var lineGroup = label
						.append('g')
						.attr('class', 'line-group');

                    var line = lineGroup
						.append('polyline')
						.attr('fill', 'none')
						.attr('stroke', '#fff')
						.attr('stroke-width', 0.5);

                    var linePoint = lineGroup
						.append('circle')
						.attr('r', 5)
						.attr('stroke', '#fff')
						.attr('stroke-width', 0.2)
						.attr('fill', '#516F8B');

                    if (data.name === 'label1') {
                        line.attr('points', linePoints);
                        linePoint
							.attr('cx', linePoints[linePoints.length - 2])
							.attr('cy', linePoints[linePoints.length - 1]);
                    } else if (data.name === 'label2') {
                        linePoint
							.attr('cx', linePoints[0][0] - 20)
							.attr('cy', linePoints[0][1] - 3);

                        line.attr('points', function () {
                            var points = [linePoints[0][0] - 20, linePoints[0][1] - 3];
                            var startAngle = 2 * Math.PI / sectorsData.length;
                            var pointArc = d3.svg.arc()
								.innerRadius(options.generalDataOptions[1].outerRadius)
								.outerRadius(options.generalDataOptions[1].outerRadius)
								.centroid({
								    endAngle: startAngle + 0.9,
								    startAngle: startAngle + 0.9
								});

                            points.push(linePoints[0][0] / 4 - 50);
                            points.push(linePoints[0][1] - 3);
                            points.push(pointArc);
                            return points;
                        });
                    }
                    return lineGroup;
                }

                function getLinePoints(data) {
                    var points = [];
                    var pointArc;
                    var startAngle;
                    if (data.name === 'label1') {
                        startAngle = labelsGroup.select('.label')[0][0]._labelAngle / 2 || 0.1;
                        pointArc = d3.svg.arc()
							.innerRadius(options.generalDataOptions[0].outerRadius)
							.outerRadius(options.generalDataOptions[0].outerRadius)
							.centroid({
							    endAngle: startAngle,
							    startAngle: startAngle
							});

                        points.push(pointArc);
                        points.push(pointArc[0]);
                        points.push(pointArc[1] - 110);
                    } else if (data.name === 'label2') {
                        startAngle = 2 * Math.PI / sectorsData.length;
                        pointArc = d3.svg.arc()
							.innerRadius(options.labelsRadius + 50)
							.outerRadius(options.labelsRadius + 50)
							.centroid({
							    endAngle: startAngle - 0.1,
							    startAngle: startAngle - 0.1
							});
                        points.push(pointArc);
                    }

                    return points;
                }
            }

            function positionItems(itemsArray) {
                var prevOffsetX = 0;
                itemsArray.forEach(function (obj) {
                    obj.el.attr('transform', 'translate(' + (prevOffsetX + (obj.extraX || 0)) + ',' + (obj.y || 0) + ')');
                    prevOffsetX += obj.el[0][0].getBBox().width + obj.space + (obj.extraSpace || 0);
                });
            }
        });

        function drawShadow(obj) {
            var dropshadow = svg.select('defs')
				.append('filter')
				.attr('id', obj.id)
				.attr('height', '130%');

            var feMerge;

            dropshadow
				.append('feGaussianBlur')
				.attr('in', 'SourceAlpha')
				.attr('stdDeviation', obj.stdDeviation);

            dropshadow
				.append('feOffset')
				.attr('dx', obj.dx)
				.attr('dy', obj.dy)
				.attr('result', 'offsetblur');

            dropshadow
				.append('feComponentTransfer')
				.append('feFuncA')
				.attr('type', 'linear')
				.attr('slope', obj.opacity)
				.attr('result', 'offsetblur');

            feMerge = dropshadow
				.append('feMerge');

            feMerge.append('feMergeNode');
            feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

            return dropshadow;
        }

        function drawInsetShadow(obj) {
            var dropshadow = svg.select('defs')
				.append('filter')
				.attr('id', obj.id)
				.attr('height', '200%')
				.attr('width', '200%')
				.attr('y', '-50%')
				.attr('x', '-50%');
            var feMerge;

            dropshadow
				.append('feComponentTransfer')
				.attr('in', 'SourceAlpha')
					.append('feFuncA')
					.attr('tableValues', '1 0')
					.attr('type', 'table');

            dropshadow
				.append('feGaussianBlur')
				.attr('stdDeviation', obj.stdDeviation);

            dropshadow
				.append('feOffset')
				.attr('result', 'offsetblur')
				.attr('dy', obj.dy)
				.attr('dx', obj.dy);

            dropshadow
				.append('feFlood')
				.attr('result', 'color')
				.attr('flood-color', obj.color);

            dropshadow
				.append('feComposite')
				.attr('operator', 'in')
				.attr('in2', 'offsetblur');

            dropshadow
				.append('feComposite')
				.attr('operator', 'in')
				.attr('in2', 'SourceAlpha');

            feMerge = dropshadow.append('feMerge');
            feMerge
				.append('feMergeNode')
				.attr('in', 'SourceGraphic');
            feMerge
				.append('feMergeNode');

            return dropshadow;
        }

        function drawBackground() {
            var bgGroup = svg
				.append('g')
				.attr('class', 'background-group')
				.attr('transform', 'translate(' + options.width / 2 + ',' + options.height / 2 + ') rotate(' + options.defaultAngle + ' 0 0)');

            options.backgroundCircles.forEach(function (el, ind) {
                el.arc = d3.svg.arc()
					.innerRadius(el.outerRadius - el.width)
					.outerRadius(el.outerRadius);
            });

            bgGroup.selectAll('.background-arc')
				.data(options.backgroundCircles)
				.enter()
					.append('g')
					.attr('class', 'background-arc')
					.append('path')
					.each(function (obj, ind) {
					    var circle = d3.select(this);
					    var shadowOptions;

					    if (obj.attrs) {
					        for (var key in obj.attrs) {
					            circle.attr(key, obj.attrs[key]);
					        }
					    }
					    if (obj.dropshadow) {
					        shadowOptions = {
					            id: 'shadowId' + (new Date()).getTime()
					        };
					        shadowOptions = jQuery.extend(shadowOptions, obj.dropshadow);
					        drawShadow(shadowOptions);
					        d3.select(this).attr('style', ' filter:url(#' + shadowOptions.id + ')');
					    }
					})
					.attr('d', function (d) {
					    return d.arc({
					        endAngle: 0,
					        startAngle: 2 * Math.PI
					    });
					});
        }

        function drawTitles(titlesGroup) {
            var titles = titlesGroup.selectAll('.title')
				.data(options.titles)
				.enter()
					.append('g')
					.attr('class', 'title')
					.each(function (d) {
					    var titleGroup = d3.select(this);
					    var points;
					    var bg = titleGroup
							.append('polygon')
							.attr('opacity', 0.6)
							.attr('stroke', '#ccc')
							.attr('stroke-width', 1)
							.attr('fill', '#000')
							.attr('shape-rendering', 'crispEdges');

					    var text = titleGroup
							.append('text')
							.attr('class', 'title-text')
							.attr('fill', '#fff')
							.text(d.text);

					    setTimeout(function () {
					        bg.attr('points', function (d) {
					            points = getPoints(text, {
					                direction: d.orientation
					            });
					            // line blur fix
					            points.forEach(function (el, ind) {
					                el[0] = Math.ceil(el[0]) - 0.5;
					                el[1] = Math.ceil(el[1]) - 0.5;
					            });

					            this._points = points;
					            return points;
					        });

					        if (!titleGroup[0][0]._text) titleGroup[0][0]._text = text;
					        if (!titleGroup[0][0]._bg) titleGroup[0][0]._bg = bg;
					        titleGroup[0][0]._bgPoints = points.join(',');
					    }, fontFixDelay);
					});

            setTimeout(function () {
                titles.attr('transform', setTitlePosition);
            }, fontFixDelay);

            function setTitlePosition(d) {
                var pos = [d.position[0], d.position[1]];
                var title = this;
                var titleBg = title._bg;
                var points = this._bgPoints.split(',');
                var positionPoint = [points[points.length - 6], points[points.length - 5]];

                if (d.orientation === 'right') {
                    pos[0] = pos[0] - positionPoint[0];
                } else {
                    pos[0] = pos[0] - positionPoint[0];
                }
                pos[1] = pos[1] - positionPoint[1];
                pos[0] = Math.ceil(pos[0]);
                pos[1] = Math.ceil(pos[1]);
                return 'translate(' + pos.join(', ') + ')';
            }

            function getPoints(text, currentOptions) {
                var opt = jQuery.extend({
                    extraSpaceX: 8,
                    extraSpaceY: 6,
                    direction: 'right'
                }, currentOptions);

                var textBox = text[0][0].getBBox();
                var points = [];
                text.attr('transform', function () {
                    return 'translate(' + opt.extraSpaceX + ',' + textBox.height + ')';
                });
                points.push([0, opt.extraSpaceY + textBox.height]); // botttom left
                points.push([getLast(0), opt.extraSpaceY]); // top left
                points.push([textBox.width + 2 * opt.extraSpaceX, getLast(1)]); // top right
                points.push([getLast(0), opt.extraSpaceY + textBox.height]); // bottom right
                if (opt.direction === 'right') {
                    points.push([23, getLast(1)]); // arrow right
                    points.push([getLast(0) - 5, getLast(1) + 9]); // arrow bottom
                    points.push([getLast(0) - 5, getLast(1) - 9]); // arrow left
                } else {
                    points.push([getLast(0) - 12, getLast(1)]); // arrow right
                    points.push([getLast(0) - 5, getLast(1) + 9]); // arrow bottom
                    points.push([getLast(0) - 5, getLast(1) - 9]); // arrow left
                }
                points.push([0, getLast(1)]);

                function getLast(ind) {
                    return ind === undefined ? points[points.length - 1] : points[points.length - 1][ind];
                }
                return points;
            }
        }
    });
}

// mobile menu init
function initMobileNav() {
    jQuery('body').mobileNav({
        hideOnClickOutside: true,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        menuDrop: '#nav'
    });
}

// popups init
function initPopups() {
    jQuery('.person').contentPopup({
        mode: 'click',
        popup: '.person-drop',
        btnOpen: '.person-opener',
        btnClose: '.close-link'
    });
}


/*
 * Simple Mobile Navigation
 */
; (function ($) {
    function MobileNav(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click',
            outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
        }, options);
        this.initStructure();
        this.attachEvents();
    }
    MobileNav.prototype = {
        initStructure: function () {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function () {
            var self = this;

            if (activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }

            this.outsideClickHandler = function (e) {
                if (self.isOpened()) {
                    var target = $(e.target);
                    if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
                        self.hide();
                    }
                }
            };

            this.openerClickHandler = function (e) {
                e.preventDefault();
                self.toggle();
            };

            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function () {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function () {
            this.container.addClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        hide: function () {
            this.container.removeClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
            }
        },
        toggle: function () {
            if (this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function () {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function () {
        var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag, timer;
        var removeClassHandler = function () {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function () {
            if (!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.mobileNav = function (options) {
        return this.each(function () {
            var params = $.extend({}, options, { container: this }),
				instance = new MobileNav(params);
            $.data(this, 'MobileNav', instance);
        });
    };
}(jQuery));


/*
 * Popups plugin
 */
; (function ($) {
    function ContentPopup(opt) {
        this.options = $.extend({
            holder: null,
            popup: '.popup',
            btnOpen: '.open',
            btnClose: '.close',
            openClass: 'popup-active',
            clickEvent: 'click',
            mode: 'click',
            hideOnClickLink: true,
            hideOnClickOutside: true,
            delay: 50
        }, opt);
        if (this.options.holder) {
            this.holder = $(this.options.holder);
            this.init();
        }
    }
    ContentPopup.prototype = {
        init: function () {
            this.findElements();
            this.attachEvents();
        },
        findElements: function () {
            this.popup = this.holder.find(this.options.popup);
            this.btnOpen = this.holder.find(this.options.btnOpen);
            this.btnClose = this.holder.find(this.options.btnClose);
        },
        attachEvents: function () {
            // handle popup openers
            var self = this;
            this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

            if (this.clickMode) {
                // handle click mode
                this.btnOpen.bind(self.options.clickEvent, function (e) {
                    if (self.holder.hasClass(self.options.openClass)) {
                        if (self.options.hideOnClickLink) {
                            self.hidePopup();
                        }
                    } else {
                        self.showPopup();
                    }
                    e.preventDefault();
                });

                // prepare outside click handler
                this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
            } else {
                // handle hover mode
                var timer, delayedFunc = function (func) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        func.call(self);
                    }, self.options.delay);
                };
                this.btnOpen.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
                this.popup.bind('mouseover', function () {
                    delayedFunc(self.showPopup);
                }).bind('mouseout', function () {
                    delayedFunc(self.hidePopup);
                });
            }

            // handle close buttons
            this.btnClose.bind(self.options.clickEvent, function (e) {
                self.hidePopup();
                e.preventDefault();
            });
        },
        outsideClickHandler: function (e) {
            // hide popup if clicked outside
            var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
            if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
                this.hidePopup();
            }
        },
        showPopup: function () {
            // reveal popup
            this.holder.addClass(this.options.openClass);
            this.popup.css({ display: 'block' });

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
                this.outsideHandlerActive = true;
                $(document).bind('click touchstart', this.outsideClickHandler);
            }
        },
        hidePopup: function () {
            // hide popup
            this.holder.removeClass(this.options.openClass);
            this.popup.css({ display: 'none' });

            // outside click handler
            if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
                this.outsideHandlerActive = false;
                $(document).unbind('click touchstart', this.outsideClickHandler);
            }
        },
        bind: function (f, scope, forceArgs) {
            return function () { return f.apply(scope, forceArgs ? [forceArgs] : arguments); };
        }
    };

    // detect touch devices
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jQuery plugin interface
    $.fn.contentPopup = function (opt) {
        return this.each(function () {
            new ContentPopup($.extend(opt, { holder: this }));
        });
    };
}(jQuery));

/*
 * jQuery In Viewport plugin
 */
; (function ($, $win) {
    'use strict';

    var ScrollDetector = (function () {
        var data = {};

        return {
            init: function () {
                var self = this;

                this.addHolder('win', $win);

                $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function () {
                    $.each(data, function (holderKey, holderData) {
                        self.calcHolderSize(holderData);

                        $.each(holderData.items, function (itemKey, itemData) {
                            self.calcItemSize(itemKey, itemData);
                        });
                    });
                });
            },

            addHolder: function (holderKey, $holder) {
                var self = this;
                var holderData = {
                    holder: $holder,
                    items: {},
                    props: {
                        height: 0,
                        scroll: 0
                    }
                };

                data[holderKey] = holderData;

                $holder.on('scroll.blockInViewport', function () {
                    self.calcHolderScroll(holderData);

                    $.each(holderData.items, function (itemKey, itemData) {
                        self.calcItemScroll(itemKey, itemData);
                    });
                });

                this.calcHolderSize(data[holderKey]);
            },

            calcHolderSize: function (holderData) {
                var holderOffset = holderData.holder.offset();

                holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
                holderData.props.offset = holderOffset ? holderOffset.top : 0;

                this.calcHolderScroll(holderData);
            },

            calcItemSize: function (itemKey, itemData) {
                itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
                itemData.height = itemData.$el.outerHeight();

                this.calcItemScroll(itemKey, itemData);
            },

            calcHolderScroll: function (holderData) {
                holderData.props.scroll = holderData.holder.scrollTop();
            },

            calcItemScroll: function (itemKey, itemData) {
                var itemInViewPortFromUp;
                var itemInViewPortFromDown;
                var itemOutViewPort;
                var holderProps = itemData.holderProps.props;

                switch (itemData.options.visibleMode) {
                    case 1:
                        itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
                        itemInViewPortFromUp = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
                        break;

                    case 2:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;

                    case 3:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;

                    default:
                        itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
                        itemInViewPortFromUp = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
                        break;
                }


                if (itemInViewPortFromUp && itemInViewPortFromDown) {
                    if (!itemData.state) {
                        itemData.state = true;
                        itemData.$el.addClass(itemData.options.activeClass)
									.trigger('in-viewport', true);

                        if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
                            delete itemData.holderProps.items[itemKey];
                        }
                    }
                } else {
                    itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;

                    if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
                        itemData.state = false;
                        itemData.$el.removeClass(itemData.options.activeClass)
									.trigger('in-viewport', false);
                    }
                }
            },

            addItem: function (el, options) {
                var itemKey = 'item' + this.getRandomValue();
                var newItem = {
                    $el: $(el),
                    options: options
                };
                var holderKeyDataName = 'in-viewport-holder';

                var $holder = newItem.$el.closest(options.holder);
                var holderKey = $holder.data(holderKeyDataName);

                if (!$holder.length) {
                    holderKey = 'win';
                } else if (!holderKey) {
                    holderKey = 'holder' + this.getRandomValue();
                    $holder.data(holderKeyDataName, holderKey);

                    this.addHolder(holderKey, $holder);
                }

                newItem.holderProps = data[holderKey];

                data[holderKey].items[itemKey] = newItem;

                this.calcItemSize(itemKey, newItem);
            },

            getRandomValue: function () {
                return (Math.random() * 100000).toFixed(0);
            },

            destroy: function () {
                $win.off('.blockInViewport');

                $.each(data, function (key, value) {
                    value.holder.off('.blockInViewport');

                    $.each(value.items, function (key, value) {
                        value.$el.removeClass(value.options.activeClass);
                        value.$el.get(0).itemInViewportAdded = null;
                    });
                });

                data = {};
            }
        };
    }());

    ScrollDetector.init();

    $.fn.itemInViewport = function (options) {
        options = $.extend({
            activeClass: 'in-viewport',
            once: true,
            holder: '',
            visibleMode: 1 // 1 - full block, 2 - half block, 3 - immediate, 4... - custom
        }, options);

        return this.each(function () {
            if (this.itemInViewportAdded) {
                return;
            }

            this.itemInViewportAdded = true;

            ScrollDetector.addItem(this, options);
        });
    };
}(jQuery, jQuery(window)));