.PHONY: build build-install clean

build:
	npm run build

build-install:
	@if [ -z "$(DEST)" ]; then \
		echo "Error: Please specify DEST variable, e.g., make build-install DEST=/path/to/folder"; \
		exit 1; \
	fi
	@echo "Building plugin..."
	@npm run build
	@echo "Installing to $(DEST)..."
	@mkdir -p $(DEST)
	@cp -r build/* $(DEST)/
	@echo "Plugin installed to $(DEST)"

clean:
	rm -rf build
