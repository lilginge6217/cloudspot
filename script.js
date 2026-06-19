(function () {
  // Nav toggle (mobile)
  window.toggleNav = function () {
    var links = document.querySelector('.nav-links');
    if (!links) return;
    var open = links.getAttribute('data-open') === 'true';
    links.setAttribute('data-open', String(!open));
    Object.assign(links.style, open
      ? { display: '' }
      : { display: 'flex', flexDirection: 'column', position: 'absolute',
          top: '64px', left: '0', right: '0', background: '#09090b',
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }
    );
  };

  // Pricing toggle
  window.setPricing = function (mode) {
    document.querySelectorAll('.toggle-btn').forEach(function (btn, i) {
      btn.classList.toggle('active', (mode === 'monthly' && i === 0) || (mode === 'annual' && i === 1));
    });
    document.querySelectorAll('.plan-amount').forEach(function (el) {
      el.textContent = el.dataset[mode];
    });
  };

  // Spend chart (SVG sparkline)
  function drawChart() {
    var canvas = document.getElementById('spendChart');
    if (!canvas) return;
    var data = [3200, 3450, 3100, 3800, 4100, 3900, 4200, 4500, 4300, 4600, 4821];
    var w = canvas.parentElement.offsetWidth || 400;
    var h = 110;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var pad = 10;
    var xs = data.map(function (_, i) { return pad + (i / (data.length - 1)) * (w - pad * 2); });
    var ys = data.map(function (v) { return pad + (1 - (v - min) / (max - min)) * (h - pad * 2); });

    var areaD = 'M' + xs[0] + ',' + h + ' L' + xs[0] + ',' + ys[0];
    var lineD = 'M' + xs[0] + ',' + ys[0];
    for (var i = 1; i < xs.length; i++) {
      var cx = (xs[i - 1] + xs[i]) / 2;
      areaD += ' C' + cx + ',' + ys[i-1] + ' ' + cx + ',' + ys[i] + ' ' + xs[i] + ',' + ys[i];
      lineD  += ' C' + cx + ',' + ys[i-1] + ' ' + cx + ',' + ys[i] + ' ' + xs[i] + ',' + ys[i];
    }
    areaD += ' L' + xs[xs.length - 1] + ',' + h + ' Z';

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', 'areaGrad');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    [['0%','#6366f1','0.25'],['100%','#6366f1','0']].forEach(function (s) {
      var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', s[0]);
      stop.setAttribute('stop-color', s[1]);
      stop.setAttribute('stop-opacity', s[2]);
      grad.appendChild(stop);
    });
    defs.appendChild(grad);
    svg.appendChild(defs);

    var area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', areaD);
    area.setAttribute('fill', 'url(#areaGrad)');
    svg.appendChild(area);

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', lineD);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', '#6366f1');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);

    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', xs[xs.length - 1]);
    dot.setAttribute('cy', ys[ys.length - 1]);
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#6366f1');
    svg.appendChild(dot);

    canvas.parentElement.replaceChild(svg, canvas);
  }

  // Fade-in on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.feature-card, .plan, .kpi').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      io.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawChart);
  } else {
    drawChart();
  }
})();
