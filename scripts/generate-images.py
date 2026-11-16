"""
Generate all site images with FAL AI (FLUX) and save them as optimized WebP.

Usage:
    set FAL_KEY=<key>            (never commit the key)
    python scripts/generate-images.py            # generate only missing images
    python scripts/generate-images.py --force grand-canyon-helicopter hero-home

Outputs:
    assets/images/tours/<slug>.webp       1280x800  (tour detail hero)
    assets/images/tours/<slug>-sm.webp    640x400   (catalog card)
    assets/images/hero/<name>.webp        (homepage hero, page header, CTA, categories)
    assets/images/hero/og-image.jpg       1200x630  (social sharing)

Tours featuring real brands/performers use generic scenes on purpose:
no likenesses, no logos.
"""
import io
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "images")
KEY = os.environ.get("FAL_KEY", "")

STYLE = (
    "Professional travel photography, {scene}, cinematic lighting, rich colors, "
    "ultra detailed, sharp focus, photorealistic, no text, no watermark, no logos"
)

# slug -> scene description (cheap model: flux/schnell)
TOURS = {
    "grand-canyon-helicopter": "a sleek helicopter flying over the Grand Canyon at golden hour, layered red rock walls, Colorado River far below",
    "vegas-strip-helicopter-night": "aerial night view from a helicopter over a glittering desert city boulevard full of neon lights and illuminated resort towers",
    "ferrari-driving-experience": "a glossy red Italian supercar speeding on a desert race track, motion blur, mountains in the background, sunny day",
    "lamborghini-driving-experience": "a bright yellow wedge-shaped exotic supercar cornering on a desert race track, low angle, dramatic sky",
    "indoor-skydiving": "a person in a flight suit and helmet floating in a vertical glass wind tunnel, indoor skydiving, dynamic pose, blue lighting",
    "machine-guns-vegas": "a modern upscale indoor shooting range, lanes with paper targets in the distance, safety earmuffs and glasses on the counter, moody lighting",
    "atv-desert-adventure": "riders on ATV quad bikes kicking up dust in the Mojave desert, red rock hills, bright blue sky, action shot",
    "flylinq-zipline": "two people in harnesses riding a zipline high above a lively pedestrian promenade at dusk, string lights and palm trees below, a giant illuminated observation wheel in the background",
    "tank-driving-experience": "a large military tank driving through a dusty desert course, dramatic dust clouds, late afternoon sun",
    "dune-buggy-desert-tour": "a dune buggy racing over sand dunes in the Nevada desert, sand spraying, golden sunset light",
    "skydiving-over-las-vegas": "tandem skydivers in freefall high above the Nevada desert, a distant city skyline and mountains below, bright clear sky",
    "cirque-du-soleil-o": "acrobats performing above a shimmering pool of water on a grand theater stage, synchronized swimmers, dramatic blue and gold stage lighting",
    "cirque-du-soleil-mystere": "colorful circus acrobats in vivid costumes performing aerial stunts on a grand theater stage, dramatic spotlights, haze",
    "cirque-du-soleil-ka": "theatrical acrobats in warrior costumes performing on a huge tilting stage platform with fire effects, epic stage lighting",
    "david-copperfield-magic-show": "a grand illusion on an elegant theater stage, a magician seen in silhouette from behind with glowing mist and floating light, red velvet curtains",
    "blue-man-group": "an energetic stage performance with drummers splashing vivid neon paint from drums, glowing blue and UV stage lights, paint frozen mid-air",
    "penn-and-teller": "a classic magic show stage with a top hat, playing cards flying through the air and a spotlight, red curtain, vintage theater",
    "ufc-fight-night": "an empty octagonal fighting cage with a plain canvas floor in a dark packed arena, dramatic overhead spotlights and haze, crowd silhouettes, wide shot",
    "nba-game-experience": "a professional indoor basketball arena during a game seen from the stands, bright polished court, cheering crowd, scoreboard glow",
    "vegas-club-crawl-nightlife": "a glamorous nightclub dance floor with a crowd, DJ booth, laser lights and confetti, purple and gold lighting",
    "topgolf-las-vegas": "a multi-level golf driving range at night with glowing colorful targets on the field, city lights skyline in the background",
    "tournament-of-kings-dinner-show": "medieval knights jousting on horseback in an indoor arena with banners, torches and a cheering audience, dinner show",
    "grand-canyon-south-rim": "sweeping panoramic view of the Grand Canyon South Rim at sunrise, a lone viewpoint railing in the foreground, vast layered canyon",
    "grand-canyon-west-rim-skywalk": "a horseshoe-shaped glass walkway bridge extending over the edge of the Grand Canyon West Rim, visitors walking on it, bright daylight",
    "hoover-dam-tour": "Hoover Dam seen from above, massive curved concrete dam, turquoise Lake Mead, rugged canyon walls, clear sunny day",
    "red-rock-canyon-tour": "striped crimson and cream sandstone cliffs in the Nevada desert, a scenic road winding through the valley, Joshua trees, golden light",
    "valley-of-fire-state-park": "Valley of Fire Nevada, swirling red and orange sandstone wave formations, an empty desert road, vivid sunset",
    "death-valley-day-tour": "Death Valley, golden sand dunes with rippled textures and cracked salt flats, distant mountains, dramatic sunrise",
    "antelope-canyon-horseshoe-bend": "inside Antelope Canyon, smooth flowing orange sandstone slot canyon walls with a beam of sunlight shining down",
    "zion-national-park": "Zion National Park, towering red and white sandstone cliffs above a green river valley, clear morning light",
    "bryce-canyon-day-tour": "Bryce Canyon amphitheater filled with orange hoodoo rock spires at sunrise, pine trees, soft pink sky",
    "area-51-extraterrestrial-highway": "a long empty desert highway in Nevada under a spectacular starry night sky with the Milky Way, a mysterious faint light on the horizon",
    "las-vegas-city-tour": "a vibrant desert city boulevard at dusk lined with palm trees, grand illuminated resort hotels and dancing fountains, light trails from traffic",
    "gordon-ramsay-hells-kitchen": "an upscale restaurant with an open kitchen and dramatic flames, a beautifully plated beef wellington on a dark table, red and blue accent lighting",
    "las-vegas-food-tour": "an elegant spread of gourmet dishes and small plates on a restaurant table, tacos, sushi, steak sliders and desserts, warm ambient light",
    "wine-tasting-experience": "a sommelier pouring red wine into a crystal glass in an elegant wine cellar, cheese board, oak barrels, warm candlelight",
    "high-roller-observation-wheel": "wide view of a complete giant ferris observation wheel with glass capsule cabins, illuminated in purple and gold against the night sky, a glittering city skyline below",
    "vip-pool-party": "a luxurious resort pool party in daylight, turquoise water, white cabanas, palm trees, people relaxing with cocktails",
    "luxury-spa-package": "a serene luxury spa room with a massage table, orchids, candles, rolled towels and warm golden light",
    "las-vegas-wedding-package": "a bride and groom seen from behind holding hands in front of an elegant white wedding chapel with flowers at sunset",
    "vip-nightclub-package": "a VIP nightclub table with champagne bottles and sparklers, velvet booth, crowd and stage lights blurred in the background",
    "luxury-limo-strip-tour": "a long black stretch limousine driving on a neon-lit city boulevard at night, reflections on wet pavement, palm trees",
}

# name -> (model, width, height, scene); key visuals use the higher-quality flux/dev
HERO = {
    "hero-home": ("dev", 1920, 1088, "spectacular aerial night view of the Las Vegas Strip, tall glamorous casino resort towers glowing in gold and neon, dancing fountains, busy boulevard with light trails, dark desert mountains on the horizon, deep black sky, luxurious cinematic mood"),
    "page-header": ("dev", 1920, 640, "dark elegant abstract background of golden bokeh city lights at night, out of focus, black and gold, luxurious, wide panorama"),
    "cta-banner": ("dev", 1920, 640, "a desert highway leading toward a distant glowing city skyline at twilight, deep red and gold sunset sky, wide panorama"),
    "about": ("dev", 1280, 800, "a small group of happy tourists with a friendly guide at a scenic desert canyon overlook at golden hour, seen from behind, warm light"),
    "about-story": ("dev", 1024, 768, "rear view of two elegant women walking away from the camera toward the grand entrance of a luxurious Las Vegas resort hotel at dusk, seen only from behind, backs to the camera, faces not visible, one woman with long blonde hair and one with long dark hair, two luxury cars parked in front of the hotel entrance, palm trees, fountains, warm golden lights"),
    "cat-adventure": ("dev", 1024, 768, "a helicopter and an off-road buggy in a dramatic red desert canyon landscape at golden hour, sense of adventure"),
    "cat-entertainment": ("dev", 1024, 768, "a grand theater stage with acrobats in mid-air under dramatic purple and gold spotlights, audience silhouettes"),
    "cat-sightseeing": ("dev", 1024, 768, "majestic layered red rock canyon panorama at sunset with a winding river, vast and serene"),
    "cat-dining": ("dev", 1024, 768, "an elegant fine dining table with gourmet plates, wine glasses and candlelight in a luxury restaurant, city lights through the window"),
}


def fal_generate(model, prompt, width, height):
    """Call the FAL sync endpoint and return the generated image as a PIL Image."""
    body = json.dumps({
        "prompt": prompt,
        "image_size": {"width": width, "height": height},
        "num_images": 1,
        "output_format": "jpeg",
    }).encode()
    req = urllib.request.Request(
        f"https://fal.run/fal-ai/flux/{model}",
        data=body,
        headers={"Authorization": f"Key {KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        url = json.load(resp)["images"][0]["url"]
    with urllib.request.urlopen(url, timeout=180) as resp:
        return Image.open(io.BytesIO(resp.read())).convert("RGB")


def save_webp(img, path, size=None, quality=80):
    if size:
        img = img.resize(size, Image.LANCZOS)
    img.save(path, "WEBP", quality=quality, method=6)


def make_tour(slug):
    img = fal_generate("schnell", STYLE.format(scene=TOURS[slug]), 1280, 800)
    save_webp(img, os.path.join(IMG, "tours", f"{slug}.webp"))
    save_webp(img, os.path.join(IMG, "tours", f"{slug}-sm.webp"), size=(640, 400))
    return slug


def make_hero(name):
    model, w, h, scene = HERO[name]
    img = fal_generate(model, STYLE.format(scene=scene), w, h)
    if name == "hero-home":
        img = img.crop((0, 4, 1920, 1084))  # trim to exact 16:9
        # Social sharing image (JPEG for widest crawler support)
        og = img.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652))
        og.save(os.path.join(IMG, "hero", "og-image.jpg"), "JPEG", quality=82, optimize=True)
        save_webp(img, os.path.join(IMG, "hero", "hero-home-sm.webp"), size=(960, 540), quality=75)
    save_webp(img, os.path.join(IMG, "hero", f"{name}.webp"), quality=78)
    return name


def main():
    if not KEY:
        sys.exit("FAL_KEY environment variable is not set")
    args = sys.argv[1:]
    force = "--force" in args
    only = [a for a in args if not a.startswith("--")]

    jobs = []
    for slug in TOURS:
        if only and slug not in only:
            continue
        if force or not os.path.exists(os.path.join(IMG, "tours", f"{slug}.webp")):
            jobs.append((make_tour, slug))
    for name in HERO:
        if only and name not in only:
            continue
        if force or not os.path.exists(os.path.join(IMG, "hero", f"{name}.webp")):
            jobs.append((make_hero, name))

    print(f"Generating {len(jobs)} image(s)...")
    failed = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [(arg, pool.submit(fn, arg)) for fn, arg in jobs]
        for arg, fut in futures:
            try:
                print("  ok  ", fut.result())
            except Exception as exc:  # keep going; rerun picks up the missing ones
                failed.append(arg)
                print("  FAIL", arg, exc)
    if failed:
        sys.exit(f"{len(failed)} failed: {', '.join(failed)}")


if __name__ == "__main__":
    main()
