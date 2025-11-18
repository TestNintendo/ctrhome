(function () {
            const container = document.querySelector(".rain");
            if (!container) return;

            const candies = Array.from({length: 4}, (_, i) => `/img/particles/snow/${i + 1}.png`);
            const drops = new Set();

            function createDrop() {
                if (drops.size >= 80) return;
                const img = document.createElement("img");
                img.className = "candy"; img.draggable = false;
                img.decoding = "async"; img.loading = "lazy";
                img.src = candies[Math.floor(Math.random() * candies.length)];

                const size = 24 + Math.random() * 32;
                const speed = 40 + Math.random() * 80;
                const rotatestart = Math.random() * 360;
                const rotatespeed = (Math.random() * 90 + 30) * (Math.random() < 0.5 ? -1 : 1); // deg/sec
                const x = Math.random() * container.clientWidth;
                const start = -size - Math.random() * window.innerHeight * 0.5;

                const drop = { el: img, x, y: start, size, speed, rot: rotatestart, rotatespeed, entered: false };
                img.style.position = "absolute";
                img.style.left = `${x}px`;
                img.style.top = `${start}px`;
                img.style.width = `${size}px`;
                img.style.transform = `rotate(${rotatestart}deg)`;
                img.style.opacity = "0";
                drops.add(drop);
                container.appendChild(img);
            }

            let last = performance.now();
            function tick(now) {
                const dt = Math.min(0.05, (now - last) / 1000);
                last = now;
                const toremove = [];
                const h = window.innerHeight;
                for (const drop of drops) {
                    drop.y += drop.speed * dt;
                    drop.rot += drop.rotatespeed * dt;
                    drop.el.style.top = `${drop.y}px`;
                    drop.el.style.transform = `rotate(${drop.rot}deg)`;
                    if (!drop.entered && drop.y >= 0) {
                        drop.entered = true;
                        try {
                            const fade = drop.el.animate([{opacity: 0}, {opacity: 1}],
                            {duration: 1000, easing: "linear", fill: "forwards"});
                            fade.onfinish = () => {drop.el.style.opacity = "1"};
                        } catch (_) {drop.el.style.opacity = "1"}
                    }
                    if (drop.y > h + drop.size + 200) toremove.push(drop);
                }; for (const d of toremove) {d.el.remove(); drops.delete(d)}
                requestAnimationFrame(tick);
            }; requestAnimationFrame(tick);

            for (let i = 0; i < 18; i++) setTimeout(createDrop, i * 15);
            setInterval(createDrop, 360);

        })();
