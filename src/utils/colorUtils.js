export default {
    parseRGBString (rbgString) {
        let values = rbgString.replaceAll("rgb", "").replaceAll("a", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "").split(",");
        return {
            r: parseFloat(values?.[0] || 1),
            g: parseFloat(values?.[1] || 1),
            b: parseFloat(values?.[2] || 1),
            a: parseFloat(values?.[3] || 1)
        }
    },
    
    normalizeColor(color) {
        if (!color) return { r: 1, g: 1, b: 1 };
        
        if (color.r <= 1 && color.g <= 1 && color.b <= 1) {
            return color;
        }
        
        return {
            r: color.r / 255,
            g: color.g / 255,
            b: color.b / 255
        };
    },

    hexToRGBA(hex, alpha = 1, darken = 1) {
        let c = hex.startsWith("#") ? hex.substring(1) : hex;
        if (c.length === 3) c = c.split("").map(x => x + x).join("");
        let r = parseInt(c.substring(0, 2), 16) * darken;
        let g = parseInt(c.substring(2, 4), 16) * darken;
        let b = parseInt(c.substring(4, 6), 16) * darken;
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
    },

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }
}