/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 1px)',
  			sm: 'calc(var(--radius) - 2px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			ai: {
  				DEFAULT: 'hsl(var(--ai))',
  				soft: 'hsl(var(--ai-soft))'
  			},
  			shu: 'hsl(var(--shu))',
  			sumi: 'hsl(var(--sumi))',
  			kinari: 'hsl(var(--kinari))',
  			stone: 'hsl(var(--stone))',
  			white: 'hsl(var(--white))'
  		},
  		fontFamily: {
  			heading: ['var(--font-heading)'],
  			body: ['var(--font-body)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'fade-up': {
  				from: { opacity: '0', transform: 'translateY(24px)' },
  				to: { opacity: '1', transform: 'translateY(0)' }
  			},
  			'fade-in': {
  				from: { opacity: '0' },
  				to: { opacity: '1' }
  			},
  			'line-grow': {
  				from: { transform: 'scaleY(0)' },
  				to: { transform: 'scaleY(1)' }
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-8px)' }
  			},
  			'wiggle': {
  				'0%, 100%': { transform: 'rotate(-3deg)' },
  				'50%': { transform: 'rotate(3deg)' }
  			},
  			'pop-in': {
  				'0%': { transform: 'scale(0)', opacity: '0' },
  				'60%': { transform: 'scale(1.15)', opacity: '1' },
  				'100%': { transform: 'scale(1)' }
  			},
  			'bob': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(4px)' }
  			},
  			'theme-curtain': {
  				'0%': { opacity: '0' },
  				'35%': { opacity: '1' },
  				'65%': { opacity: '1' },
  				'100%': { opacity: '0' }
  			},
  			'theme-sweep': {
  				'0%': { transform: 'translateX(-100%)', opacity: '0' },
  				'20%': { opacity: '1' },
  				'100%': { transform: 'translateX(100%)', opacity: '0' }
  			}
  			},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-up': 'fade-up 0.8s ease-out forwards',
  			'fade-in': 'fade-in 1.2s ease-out forwards',
  			'line-grow': 'line-grow 1.2s ease-out forwards',
  			'float': 'float 6s ease-in-out infinite',
  			'wiggle': 'wiggle 0.6s ease-in-out',
  			'pop-in': 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
  			'bob': 'bob 1.8s ease-in-out infinite',
  			'theme-curtain': 'theme-curtain 0.7s ease-in-out forwards',
  			'theme-sweep': 'theme-sweep 0.4s ease-in-out 0.18s forwards'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
